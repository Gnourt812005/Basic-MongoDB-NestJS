import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/user/schemas/user.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop()
  price: number;
}

@Schema()
export class Order {
  @Prop({ 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'} ]
  })
  users: Types.ObjectId | User;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[]

  @Prop({ default: Date.now })
  createdAt: Date;

  @Virtual({
    get: function (this: Order) {
      return this.items.reduce((total, item) => {
        return total + (item.price || 0) * item.quantity;
      }, 0)
    }
  })
  totalPrice: number 
}

export const OrderSchema = SchemaFactory.createForClass(Order)