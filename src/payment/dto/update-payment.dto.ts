import { IsNumber, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsNumber()
  balance: number;
}
