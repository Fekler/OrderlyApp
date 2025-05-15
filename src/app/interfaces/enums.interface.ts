export enum PaymentMethod {
  CreditCard = 0,
  DebitCard = 1,
  Pix = 2,
  Cash = 3
}

export enum OrderStatus {
  Pending = 0,
  Approved = 1,
  Cancelled = 2,
  Processing = 3,
  Shipped = 4,
  Delivered = 5,
  InsuficientProducts = 6
}

export enum UserRole {
  Client = 0,
  Seller = 1,
  Admin = 2
}
