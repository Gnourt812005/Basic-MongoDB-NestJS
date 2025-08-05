import { OrderModel } from "../models/order.model"

export interface IOrderRepository {
  findById(id: string): Promise<OrderModel | null>
  findByUserId(userId: string): Promise<OrderModel[] | null>
  create(order: OrderModel): Promise<OrderModel | null>
}