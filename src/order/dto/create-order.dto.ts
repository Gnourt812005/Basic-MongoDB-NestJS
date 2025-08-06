import { IsNumber, IsString } from 'class-validator';

class Item {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  userId: String;

  items: Item[];
}
