import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IOrderRepository } from './interfaces/order-repository.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderModel } from './models/order.model';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class OrderService {
  constructor(
    @Inject("IOrderRepository") 
    private orderRepository: IOrderRepository
  ) {}

  async create(createdOrderDto: CreateOrderDto): Promise<OrderResponseDto | null> {
    const order = new OrderModel({
      userId: createdOrderDto.userId,
      items: createdOrderDto.items 
    })
    const newOrder = await this.orderRepository.create(order)
    if (!newOrder) 
      throw new BadRequestException("Bad request");
    
    return {
      id: newOrder.id as string,
      userId: newOrder.userId,
      items: newOrder.items,
      createdAt: newOrder.createdAt
    }
  }

  // private convert/

}
