import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Location } from '@angular/common';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { JwtDecoder } from '../../utils/jwt-decoder';
import { Router } from '@angular/router';
import { OrderStatus, PaymentMethod } from '../../interfaces/enums.interface'

interface OrderItem {
  uuid: string;
  productId: string;
  orderId: string;
  quantity: number;
  productName?: string; 
  unitPrice?: number;        
  totalPrice?: number;        
}

interface Order {
  uuid: string;
  orderNumber: string;
  orderDate?: string;
  createByUserEmail?: string;
  createByUserName?: string;
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: number;
  status?: number;
  totalAmount: number;
  actionedByUserUuid?: string;
  showDetails?: boolean; 
  orderItems?: OrderItem[];
}

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  showUuidColumn: boolean = false;
  isClientPage: boolean = false;
  showDetails: boolean = false; 



  constructor(private orderService: OrderService,
    private location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
    this.isClientPage = this.router.url.startsWith('/client/orders'); // Verifica se a rota começa com /client/orders
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
        } else {
          this.errorMessage = response.message || 'Erro ao carregar os pedidos.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os pedidos.';
        console.error('Erro ao carregar os pedidos:', error);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  //goToEditOrder(uuid: string): void {
  //  this.location.go(`/orders/${uuid}/edit`);
  //}

  goToCreateOrder(): void {
    this.router.navigate(['/orders/create']);
  }

  updateOrderStatus(orderUuid: string, newStatus: number): void {
    this.orderService.updateOrderStatus(orderUuid, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Status do pedido atualizado:', response.message);
          this.loadOrders();
        } else {
          this.errorMessage = response.message || 'Erro ao atualizar o status do pedido.';
        }
      },
    });
  }

  toggleDetails(order: any): void {
    order.showDetails = !order.showDetails;
  }

  canManageOrder(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = new JwtDecoder().decodeToken(token);
      return decodedToken?.role === 'Admin' || decodedToken?.role === 'Seller';
    }
    return false;
  }
  getPaymentMethodText(paymentMethod: number | undefined): string {
    switch (paymentMethod) {
      case PaymentMethod.CreditCard:
        return 'Cartão de Crédito';
      case PaymentMethod.DebitCard:
        return 'Cartão de Débito';
      case PaymentMethod.Pix:
        return 'Pix';
      case PaymentMethod.Cash:
        return 'Dinheiro';
      default:
        return 'Desconhecido';
    }
  }
  getOrderStatusText(status: number | undefined): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'Pendente';
      case OrderStatus.Approved:
        return 'Aprovado';
      case OrderStatus.Cancelled:
        return 'Cancelado';
      case OrderStatus.Processing:
        return 'Processando';
      case OrderStatus.Shipped:
        return 'Enviado';
      case OrderStatus.Delivered:
        return 'Entregue';
      case OrderStatus.InsuficientProducts:
        return 'Produtos Insuficientes';

      default:
        return 'Desconhecido';
    }
  }
}

function decodeToken(token: string): any {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
