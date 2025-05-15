import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface'; 
import { CreateOrderDto, CreateOrderItemDto } from '../interfaces/order.interface';

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
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: number; 
  status?: number;      
  actionedByUserUuid?: string;
  totalAmount: number;
  orderItems?: OrderItem[];
}

interface UpdateOrderStatusRequest {
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/api/v1/orders`;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<ApiResponse<Order[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Order[]>>(this.apiUrl, { headers });

  }
  createOrder(order: CreateOrderDto): Observable<ApiResponse<Order>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<Order>>(this.apiUrl, order, { headers });
  }
  updateOrderStatus(orderUuid: string, status: number): Observable<ApiResponse<any>> {
    const body: UpdateOrderStatusRequest = { status };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/manager-order?orderUuid=${orderUuid}&status=${status}`,
      body,
      { headers }
    );
  }
}
