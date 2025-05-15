import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus, PaymentMethod } from '../interfaces/enums.interface';

@Pipe({
  name: 'paymentMethod',
  standalone: false
})
export class PaymentMethodPipe implements PipeTransform {
  transform(value: number): string {
    return PaymentMethod[value];
  }
}

@Pipe({
  name: 'orderStatus',
  standalone: false
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: number): string {
    return OrderStatus[value];
  }
}
