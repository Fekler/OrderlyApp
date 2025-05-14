import { PaymentMethod, OrderStatus } from '../interfaces/enums.interface';
export interface CreateOrderItemDto {
  productId: string;
  orderId: string;
  quantity: number;
}

export interface OrderItemDto {
  uuid: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UpdateOrderItemDto {
  uuid: string;
  productId: string;
  orderId: string;
  quantity: number;
}

export interface CreateOrderDto {
  orderDate?: Date;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: PaymentMethod;
  createByUserUuid?: string;
  orderItems: CreateOrderItemDto[];
}

export interface OrderDto {
  uuid: string;
  orderNumber: string;
  orderDate: Date;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createByUserUuid: string;
  actionedByUserUuid?: string;
  actionedAt?: Date;
  orderItems: OrderItemDto[];
}

export interface UpdateOrderDto {
  uuid: string;
  orderDate?: Date;
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: PaymentMethod;
  status?: OrderStatus;
  actionedByUserUuid?: string;
  orderItems: UpdateOrderItemDto[];
}
