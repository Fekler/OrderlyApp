interface OrderItem {
  uuid: string;
  productId: string;
  orderId: string;
  quantity: number;
}

interface Order {
  uuid: string;
  orderNumber: string;
  orderDate?: string;
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
  status?: string;
  actionedByUserUuid?: string;
  orderItems?: OrderItem[];
}
