import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { IPaymentRepository } from './interfaces/payment-repository.interface';
import { PaymentModel } from './models/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject("IPaymentRepository")
    private paymentRepository: IPaymentRepository
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const existingPayment = await this.paymentRepository.findByUserId(createPaymentDto.userId);
    
    if (existingPayment) {
      throw new InternalServerErrorException('Payment account already exists for this user');
    }

    const paymentModel = new PaymentModel({
      userId: createPaymentDto.userId,
      balance: createPaymentDto.balance || 0,
    });

    const newPayment = await this.paymentRepository.create(paymentModel);

    if (!newPayment) {
      throw new InternalServerErrorException('Failed to create payment account');
    }

    return {
      id: newPayment.id,
      userId: newPayment.userId,
      balance: newPayment.balance,
      createdAt: newPayment.createdAt,
      updatedAt: newPayment.updatedAt,
    };
  }

  async getByUserId(userId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findByUserId(userId);

    if (!payment) {
      throw new NotFoundException('Payment account not found for this user');
    }

    return {
      id: payment.id,
      userId: payment.userId,
      balance: payment.balance,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  async updateBalance(userId: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const payment = new PaymentModel({
      userId: userId,
      balance: updatePaymentDto.balance
    })
    const updatedPayment = await this.paymentRepository.updateBalance(payment);

    if (!updatedPayment) {
      throw new NotFoundException('Payment account not found for this user');
    }

    return {
      id: updatedPayment.id,
      userId: updatedPayment.userId,
      balance: updatedPayment.balance,
      createdAt: updatedPayment.createdAt,
      updatedAt: updatedPayment.updatedAt,
    };
  }
}
