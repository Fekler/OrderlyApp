import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Location } from '@angular/common';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { JwtDecoder } from '../../utils/jwt-decoder';
import { Router } from '@angular/router';
import { OrderStatus, PaymentMethod } from '../../interfaces/enums.interface'
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
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
  styleUrls: ['./order-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  showUuidColumn: boolean = false;
  isClientPage: boolean = false;
  showDetails: boolean = false; 
  displayedColumns: string[] = [];
  detailColumns: string[] = ['expandedDetail'];
  dataSource: MatTableDataSource<Order>;
  expandedElement: Order | null = null;


  constructor(private orderService: OrderService,
    private location: Location,
    private router: Router)
  {
    this.dataSource = new MatTableDataSource(this.orders); // Inicialize dataSource

  }

  ngOnInit(): void {
    this.isClientPage = this.router.url.startsWith('/client/orders');
    this.displayedColumns = this.getDisplayedColumns();
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.orders = response.data;
          // Se você usar MatTableDataSource:
          this.dataSource.data = this.orders;
        } else {
          this.errorMessage = response.message || 'Erro ao carregar pedidos.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar pedidos.';
        console.error('Erro:', error);
        this.isLoading = false;
      }
    });
  }

  getDisplayedColumns(): string[] {
    const columns = [];

    if (this.showUuidColumn) {
      columns.push('uuid');
    }

    columns.push(
      'orderNumber',
      'orderDate',
      'client',
      'email',
      'shippingAddress',
      'billingAddress',
      'paymentMethod',
      'status',
      'totalAmount',
      'details'
    );

    if (this.canManageOrder()) {
      columns.push('actions');
    }

    return columns;
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
  getButtonText(currentOrder: Order): string {
    // console.log('getButtonText called for order:', currentOrder, 'expandedElement is:', this.expandedElement); // Para depuração
    return this.expandedElement === currentOrder ? 'Recolher' : 'Expandir';
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
