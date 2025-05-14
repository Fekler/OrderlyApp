import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { OrderService } from '../services/order.service';
// Defina a URL da API como uma constante
const LOGIN_ENDPOINT = '/api/auth/login';
interface OrderItem {
  uuid: string;
  productId: string;
  orderId: string;
  quantity: number;
}

interface Order {
  uuid: string;
  orderNumber: string;
  orderDate?: string;
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
  status?: string;
  actionedByUserUuid?: string;
  orderItems?: OrderItem[];
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

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  showOrderList = false;
  orders: Order[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const url = `${environment.apiBaseUrl}${LOGIN_ENDPOINT}`;
      this.http.post<any>(url, this.loginForm.value)
        .subscribe({
          next: (response) => {
            const token = response.data.accessToken; 
            if (token) {
              localStorage.setItem('token', token);
              console.log('Token JWT:', token); 

              const decodedToken = decodeToken(token);
              if (decodedToken) {
                const role = decodedToken.role;
                let redirectUrl = '/dashboard'; 

                switch (role) {
                  case 'Admin':
                    redirectUrl = '/dashboard'; 
                    break;
                  case 'Client':
                    redirectUrl = '/client/orders'; 
                    break;
                  case 'Seller':
                    redirectUrl = '/stock'; 
                    break;
                  default:
                    this.snackBar.open('Role desconhecida. Redirecionando para o dashboard.', 'Fechar', { duration: 5000 });
                }

                this.router.navigate([redirectUrl]);
                this.snackBar.open('Login successful!', 'Close', { duration: 3000 });

              } else {
                this.snackBar.open('Login successful, but token could not be decoded!', 'Close', { duration: 5000 });
              }
            } else {
              this.snackBar.open('Login successful, but token not received!', 'Close', { duration: 5000 });
            }
          },
          error: (error) => {
            console.error('Login failed:', error);
            this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 });
          }
        });
    }
  }
}
