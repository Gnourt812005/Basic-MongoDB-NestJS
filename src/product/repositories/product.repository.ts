import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProductRepository } from "../interfaces/product-repository.interface";
import { Product, ProductDocument } from "../schemas/product.schema";
import { ProductModel } from "../models/product.model";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>
  ) {}

  async create(product: ProductModel): Promise<ProductModel | null> {
    const newProduct = new this.productModel({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
    await newProduct.save();
    return newProduct ? this.convertToModel(newProduct) : null;
  }

  async findById(id: string): Promise<ProductModel | null> {
    const product = await this.productModel.findById(id).exec();
    return product ? this.convertToModel(product) : null;
  }

  async findAll(): Promise<ProductModel[]> {
    const products = await this.productModel.find().exec();
    return products.map(product => this.convertToModel(product));
  }

  async update(id: string, productData: Partial<ProductModel>): Promise<ProductModel | null> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { ...productData, updatedAt: new Date() },
        { new: true }
      )
      .exec();
    return product ? this.convertToModel(product) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private convertToModel(productDocument: ProductDocument): ProductModel {
    return new ProductModel({
      id: productDocument._id.toString(),
      name: productDocument.name,
      quantity: productDocument.quantity,
      price: productDocument.price,
      createdAt: productDocument.createdAt,
      updatedAt: productDocument.updatedAt,
    });
  }
}
