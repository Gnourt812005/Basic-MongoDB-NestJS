import { IsDateString, IsNumber, IsString } from "class-validator";

class Item {
  @IsString()
  id: string
  
  @IsNumber() 
  quantity: number

  @IsNumber() 
  price: number
}

export class OrderResponseDto {
  @IsString()
  id: string 
  
  @IsString()
  userId: String;

  items: Item[];  

  @IsDateString()
  createdAt: Date 
} 