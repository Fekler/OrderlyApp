import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';


interface SalesSummary {
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
}

interface ActiveCustomer {
  customerId: string;
  customerName: string;
  orderCount: number;
}

interface PendingOrdersCount {
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salesSummary: SalesSummary | null = null;
  pendingOrdersCount: number | null = null;
  mostActiveCustomers: ActiveCustomer[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getSalesSummary().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesSummary = response.data;
        } else {
          this.errorMessage += response.message ? `Erro ao carregar resumo de vendas: ${response.message}\n` : 'Erro ao carregar resumo de vendas.\n';
        }
      },
      error: (error) => {
        this.errorMessage += `Erro ao carregar resumo de vendas: ${error}\n`;
      }
    });

    this.dashboardService.getPendingOrdersCount().subscribe({
      next: (response) => {
        if (response.success && response.data !== undefined && response.data !== null) {
          this.pendingOrdersCount = response.data;
        } else {
          this.errorMessage += response.message ? `Erro ao carregar pedidos pendentes: ${response.message}\n` : 'Erro ao carregar pedidos pendentes.\n';
        }
      },
      error: (error) => {
        this.errorMessage += `Erro ao carregar pedidos pendentes: ${error}\n`;
      }
    });

    this.dashboardService.getMostActiveCustomers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.mostActiveCustomers = response.data;
        } else {
          this.errorMessage += response.message ? `Erro ao carregar clientes ativos: ${response.message}` : 'Erro ao carregar clientes ativos.';
        }
      },
      error: (error) => {
        this.errorMessage += `Erro ao carregar clientes ativos: ${error}`;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
