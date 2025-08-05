import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: "IProductRepository",
      useClass: ProductRepository
    }
  ],
  exports: ["IProductRepository", ProductService]
})
export class ProductModule {}
