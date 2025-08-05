import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UserModule, AuthModule, OrderModule, ProductModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
