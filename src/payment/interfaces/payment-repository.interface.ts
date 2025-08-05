import { PaymentModel } from "../models/payment.model";

export interface IPaymentRepository {
  create(payment: PaymentModel): Promise<PaymentModel | null>;
  findByUserId(userId: string): Promise<PaymentModel | null>;
  updateBalance(payment: PaymentModel): Promise<PaymentModel | null>;
}
