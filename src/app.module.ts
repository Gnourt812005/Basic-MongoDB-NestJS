import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("MONGO_URI")
      }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET") as string,
        signOptions: {expiresIn: "1h"},
        global: true 
      }),
      inject: [ConfigService]
    }),
    UserModule, AuthModule, OrderModule, ProductModule, PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
