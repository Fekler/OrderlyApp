import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface'; 

interface OrderItem {
  uuid: string;
  productId: string;
  orderId: string;
  quantity: number;
}

interface Order {
  uuid: string;
  orderNumber: string;
  orderDate?: string; // Ou Date, dependendo do formato da API
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string; // Corresponde ao enum PaymentMethod
  status?: string;       // Corresponde ao enum OrderStatus
  actionedByUserUuid?: string;
  orderItems?: OrderItem[];
}

interface UpdateOrderStatusRequest {
  status: string;
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

  updateOrderStatus(orderUuid: string, status: string): Observable<ApiResponse<any>> {
    const body: UpdateOrderStatusRequest = { status };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/api/v1/manager-order?orderUuid=${orderUuid}&status=${status}`,
      body,
      { headers }
    );
  }
}
