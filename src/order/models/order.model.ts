interface Item {
  id: string;
  quantity: number;
  price: number;
}

export class OrderModel {
  id: string;
  userId: String;
  items: Item[];
  createdAt: Date;

  constructor(data: Partial<OrderModel>) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.items = data.items || [];
    this.createdAt = data.createdAt || new Date();
  }
}
