export class ProductModel {
  id: string;
  name: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ProductModel>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.quantity = data.quantity || 0;
    this.price = data.price || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
