import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post()
  async create(
    @Body() createdOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto | null> {
    return await this.orderService.create(createdOrderDto);
  }
}
