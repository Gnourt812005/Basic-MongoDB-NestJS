import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../interfaces/order-repository.interface';
import { OrderModel } from '../models/order.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/product/schemas/product.schema';
import { Payment, PaymentDocument } from 'src/payment/schemas/payment.schema';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async findById(id: string): Promise<OrderModel | null> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      console.log('Start write 1');
      await this.orderModel
        .updateOne({ _id: new Types.ObjectId(id) }, { createdAt: new Date() })
        .session(session);
      console.log('Complete write 1');

      await this.sleep(10000);

      // await this.sleep(5000);
      console.log('Start read 1');
      const res = await this.orderModel
        .findOne({ _id: new Types.ObjectId(id) })
        .session(session);
      console.log('Complete read 1');

      // console.log("Start read 2");
      // await this.orderModel.findOne({_id: new Types.ObjectId(id)}).session(session);
      // console.log("Complete read 2");

      console.log('Start commit');
      await session.commitTransaction();
      console.log('Complete commit');
      return this.convertToModel(res);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    return null;
  }

  async findByUserId(userId: string): Promise<OrderModel[] | null> {
    return null;
  }

  // async create(order: OrderModel): Promise<OrderModel | null> {
  //   const session = await this.connection.startSession();
  //   const res = await this.connection.transaction(async (session) => {
  //     let totalPrice = 0;
  //     // Check product availability
  //     for (const item of order.items) {
  //       const product = await this.productModel
  //         .findOne({ _id: new Types.ObjectId(item.id) })
  //         .session(session);
  //       if (!product) {
  //         throw new Error('Product is not existed');
  //       }
  //       if (product.quantity < item.quantity) {
  //         throw new Error('Product is out of stock');
  //       }
  //       totalPrice += item.price * item.quantity;
  //     }

  //     // Check balance
  //     const payment = await this.paymentModel
  //       .findOne({ user: new Types.ObjectId(order.userId as string) })
  //       .session(session);

  //     if (!payment) {
  //       throw new Error('Payment is not valid');
  //     }

  //     if (payment.balance < totalPrice) {
  //       throw new Error('Not enough balance');
  //     }

  //     const newOrder = {
  //       user: new Types.ObjectId(order.userId as string),
  //       items: order.items.map((item) => ({
  //         productId: new Types.ObjectId(item.id),
  //         quantity: item.quantity,
  //         price: item.price,
  //       })),
  //       createdAt: new Date(),
  //     };

  //     console.log("Waiting...")
  //     await this.sleep(5000);
  //     console.log("Continue")

  //     const res = await this.orderModel.create([newOrder], { session });
  //     const createdOrder = res[0];
  //     await this.paymentModel
  //       .updateOne(
  //         { user: new Types.ObjectId(order.userId as string) },
  //         { $inc: { balance: -totalPrice }, $set: { updatedAt: new Date() } },
  //       )
  //       .session(session);

  //     for (const item of order.items) {
  //       await this.productModel
  //         .updateOne(
  //           { _id: new Types.ObjectId(item.id) },
  //           {
  //             $inc: { quantity: -item.quantity },
  //             $set: { updatedAt: new Date() },
  //           },
  //         )
  //         .session(session);
  //     }
  //     return createdOrder
  //   },
  //   {
  //   })

  //   session.endSession()
  //   return this.convertToModel(res);
  // }
  async create(order: OrderModel): Promise<OrderModel | null> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      let totalPrice = 0;
      // Check product availability
      for (const item of order.items) {
        const product = await this.productModel
          .findOne({ _id: new Types.ObjectId(item.id) })
          .session(session);
        if (!product) {
          throw new Error('Product is not existed');
        }
        if (product.quantity < item.quantity) {
          throw new Error('Product is out of stock');
        }
        totalPrice += item.price * item.quantity;
      }

      // Check balance
      const payment = await this.paymentModel
        .findOne({ user: new Types.ObjectId(order.userId as string) })
        .session(session);

      if (!payment) {
        throw new Error('Payment is not valid');
      }

      if (payment.balance < totalPrice) {
        throw new Error('Not enough balance');
      }

      const newOrder = {
        user: new Types.ObjectId(order.userId as string),
        items: order.items.map((item) => ({
          productId: new Types.ObjectId(item.id),
          quantity: item.quantity,
          price: item.price,
        })),
        createdAt: new Date(),
      };

      console.log('Waiting... 2');
      await this.sleep(10000);
      console.log('Continue');

      const res = await this.orderModel.create([newOrder], { session });
      const createdOrder = res[0];
      await this.paymentModel
        .updateOne(
          { user: new Types.ObjectId(order.userId as string) },
          { $inc: { balance: -totalPrice }, $set: { updatedAt: new Date() } },
        )
        .session(session);

      for (const item of order.items) {
        await this.productModel
          .updateOne(
            { _id: new Types.ObjectId(item.id) },
            {
              $inc: { quantity: -item.quantity },
              $set: { updatedAt: new Date() },
            },
          )
          .session(session);
      }

      // console.log("Waiting...")
      // await this.sleep(10000);
      // console.log("Continue")

      await session.commitTransaction();
      return this.convertToModel(createdOrder);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private convertToModel(orderDocument: any): OrderModel {
    return new OrderModel({
      id: orderDocument._id.toString(),
      userId: orderDocument.user.toString(),
      items: orderDocument.items.map((item: any) => ({
        id: item.productId.toString(),
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: orderDocument.createdAt,
    });
  }
}
