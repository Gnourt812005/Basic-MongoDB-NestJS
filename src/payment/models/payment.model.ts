export class PaymentModel {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<PaymentModel>) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.balance = data.balance || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
