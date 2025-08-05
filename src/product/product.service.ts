import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from './interfaces/product-repository.interface';
import { ProductModel } from './models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject("IProductRepository")
    private productRepository: IProductRepository
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const productModel = new ProductModel({
      name: createProductDto.name,
      quantity: createProductDto.quantity,
      price: createProductDto.price,
    });

    const newProduct = await this.productRepository.create(productModel);

    if (!newProduct) {
      throw new InternalServerErrorException('Failed to create product');
    }

    return this.toResponseDto(newProduct);
  }

  async getAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(product => this.toResponseDto(product));
  }

  async getById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toResponseDto(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const updatedProduct = await this.productRepository.update(id, updateProductDto);

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return this.toResponseDto(updatedProduct);
  }

  private toResponseDto(product: ProductModel): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
