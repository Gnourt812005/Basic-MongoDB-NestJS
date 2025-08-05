import { Injectable } from "@nestjs/common";
import { IOrderRepository } from "../interfaces/order-repository.interface";
import { OrderModel } from "../models/order.model";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Types } from "mongoose";
import { ProductDocument } from "src/product/schemas/product.schema";

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor (
    @InjectConnection() private readonly connection: Connection
  ) {}

  async findById(id: string): Promise<OrderModel | null> {
    
    return null
  }

  async findByUserId(userId: string): Promise<OrderModel[] | null> {
    return null
  }

  async create(order: OrderModel): Promise<OrderModel | null> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      
      let totalPrice = 0;

      // Check product availability
      for (const item of order.items) {
        const product = await this.connection.collection("products").findOne(
          { _id: new Types.ObjectId(item.id) },
          { session }
        );
        if (!product) {
          throw new Error("Product is not existed");
        }
        if (product.quantity < item.quantity) {
          throw new Error("Product is out of stock");
        }
        totalPrice += item.price * item.quantity;
      }

      // Check balance
      const payment = await this.connection.collection("payments").findOne(
        { user: new Types.ObjectId(order.userId as string) },
        { session }
      )

      if (!payment) {
        throw new Error("Payment is not valid");
      }

      if (payment.balance < totalPrice) {
        throw new Error("Not enough balance");
      }
      
      const newOrder = {
        user: new Types.ObjectId(order.userId as string),
        items: order.items.map((item) => ({
          productId: new Types.ObjectId(item.id),
          quantity: item.quantity,
          price: item.price 
        })),
        createdAt: new Date() 
      };
      
      const res = await this.connection.collection("orders").insertOne(newOrder, { session }) 
      await this.connection.collection("payments").updateOne(
        { user: new Types.ObjectId(order.userId as string) },
        { $inc: { balance: -totalPrice }, $set: { updatedAt: new Date() } },
        { session } 
      )

      for (const item of order.items) {
        const product = await this.connection.collection("products").findOne(
          { _id: new Types.ObjectId(item.id) },
          { session }
        );

        if (!product) {
          throw new Error("Product is not existed"); 
        }

        await this.connection.collection("products").updateOne(
          { _id: new Types.ObjectId(item.id) },
          { 
            $inc: { quantity: -item.quantity },
            $set: { updatedAt: new Date() }
          },
          { session }
        );
      }

      // Get the created order with proper data
      const createdOrder = await this.connection.collection("orders").findOne(
        { _id: res.insertedId },
        { session }
      );
      
      await session.commitTransaction();
      return this.convertToModel(createdOrder);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      (await session).endSession();
    }
  }

  private convertToModel(orderDocument: any): OrderModel {
    return new OrderModel({
      id: orderDocument._id.toString(),
      userId: orderDocument.user.toString(),
      items: orderDocument.items.map((item: any) => ({
        id: item.productId.toString(),
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: orderDocument.createdAt
    });
  }
}