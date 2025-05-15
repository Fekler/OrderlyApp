import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



interface SalesSummaryResponse {
  success: boolean;
  data: SalesSummaryDto;
  message?: string;
}

interface PendingOrdersCountResponse {
  success: boolean;
  data: number;
  message?: string;
}

interface MostActiveCustomersResponse {
  success: boolean;
  data: ActiveCustomerDto[];
  message?: string;
}

interface SalesSummaryDto {
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
}

interface ActiveCustomerDto {
  customerId: string;
  customerName: string;
  orderCount: number;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/api/v1/dashboard`;

  constructor(private http: HttpClient) { }

  getSalesSummary(): Observable<SalesSummaryResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<SalesSummaryResponse>(`${this.apiUrl}/sales-summary`, { headers });
  }

  getPendingOrdersCount(): Observable<PendingOrdersCountResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PendingOrdersCountResponse>(`${this.apiUrl}/pending-orders-count`, { headers });
  }

  getMostActiveCustomers(): Observable<MostActiveCustomersResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<MostActiveCustomersResponse>(`${this.apiUrl}/most-active-customers`, { headers });
  }
}

