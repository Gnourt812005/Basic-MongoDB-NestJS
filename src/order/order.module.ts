import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: "IOrderRepository",
      useClass: OrderRepository
    }
  ]
})
export class OrderModule {}
