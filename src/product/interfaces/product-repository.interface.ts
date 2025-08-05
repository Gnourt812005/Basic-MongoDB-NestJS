import { ProductModel } from "../models/product.model";

export interface IProductRepository {
  create(product: ProductModel): Promise<ProductModel | null>;
  findById(id: string): Promise<ProductModel | null>;
  findAll(): Promise<ProductModel[]>;
  update(id: string, product: Partial<ProductModel>): Promise<ProductModel | null>;
  delete(id: string): Promise<boolean>;
}
