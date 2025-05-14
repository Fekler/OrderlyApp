export enum PaymentMethod {
  CreditCard = 0,
  DebitCard = 1,
  Pix = 2,
  Cash = 3
}

export enum OrderStatus {
  Pending = 0,
  Approved = 1,
  Cancelled = 2
}

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
  Manager = 'Manager'
}

//paymentMethodMap: { [key: string]: number } = {
//  'CreditCard': PaymentMethod.CreditCard,
//    'DebitCard': PaymentMethod.DebitCard,
//      'BankTransfer': PaymentMethod.BankTransfer,
//        'Cash': PaymentMethod.Cash,
//          'Pix': PaymentMethod.Pix // Certifique-se de que o valor do enum para Pix esteja correto
//};
