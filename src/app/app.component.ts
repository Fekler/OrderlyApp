import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


interface DecodedToken {
  nameid?: string;
  email?: string;
  unique_name?: string;
  role?: string;
}


function decodeToken(token: string): DecodedToken | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showHeader = false;
  loggedInUserName: string | null = null;
  loggedInUserRole: string | null = null;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showHeader = event.url !== '/login';
      this.loadUserInfo();
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateHeaderVisibility(event.urlAfterRedirects);
      this.loadUserInfo();
    });

    // chamada inicial caso não navegue após carregamento
    this.updateHeaderVisibility(this.router.url);
    this.loadUserInfo();
  }

  updateHeaderVisibility(currentUrl: string): void {
    // Exibe o header somente se não estiver na rota de login
    this.showHeader = !['/login', '/register'].includes(currentUrl);
  }

  loadUserInfo(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        this.loggedInUserName = decodedToken.unique_name || decodedToken.email || 'Usuário';
        this.loggedInUserRole = decodedToken.role || 'Desconhecido';
      } else {
        this.loggedInUserName = null;
        this.loggedInUserRole = null;
      }
    } else {
      this.loggedInUserName = null;
      this.loggedInUserRole = null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  shouldShowDashboard(): boolean {
    return this.loggedInUserRole === 'Admin';
  }

  shouldShowUsuarios(): boolean {
    return this.loggedInUserRole === 'Admin';
  }

  shouldShowProdutos(): boolean {
    return this.loggedInUserRole === 'Admin' || this.loggedInUserRole === 'Seller';
  }

  shouldShowPedidos(): boolean {
    return this.loggedInUserRole === 'Admin' || this.loggedInUserRole === 'Seller' || this.loggedInUserRole === 'Client';
  }
  getOrderLink(): string {
    if (this.loggedInUserRole === 'Admin') {
      return '/order-list';
    } else if (this.loggedInUserRole === 'Seller') {
      return '/order-list';
    } else if (this.loggedInUserRole === 'Client') {
      return '/client/orders';
    }
    return '';
  }
}
