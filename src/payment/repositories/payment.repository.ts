import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPaymentRepository } from "../interfaces/payment-repository.interface";
import { Payment, PaymentDocument } from "../schemas/payment.schema";
import { PaymentModel } from "../models/payment.model";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>
  ) {}

  async create(payment: PaymentModel): Promise<PaymentModel | null> {
    const newPayment = new this.paymentModel({
      user: payment.userId,
      balance: payment.balance,
    });
    await newPayment.save();
    return newPayment ? this.convertToModel(newPayment) : null;
  }

  async findByUserId(userId: string): Promise<PaymentModel | null> {
    const payment = await this.paymentModel.findOne({ user: userId }).exec();
    return payment ? this.convertToModel(payment) : null;
  }

  async updateBalance(payment: PaymentModel): Promise<PaymentModel | null> {
    const updatePayment = await this.paymentModel
      .findOneAndUpdate(
        { user: payment.userId },
        { balance: payment.balance, updatedAt: new Date() },
        { new: true }
      )
      .exec();
    return updatePayment ? this.convertToModel(updatePayment) : null;
  }

  private convertToModel(paymentDocument: PaymentDocument): PaymentModel {
    return new PaymentModel({
      id: paymentDocument._id.toString(),
      userId: paymentDocument.user.toString(),
      balance: paymentDocument.balance,
      createdAt: paymentDocument.createdAt,
      updatedAt: paymentDocument.updatedAt,
    });
  }
}
