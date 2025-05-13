import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

// Defina a URL da API como uma constante
const LOGIN_ENDPOINT = '/api/auth/login';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const url = `${environment.apiBaseUrl}${LOGIN_ENDPOINT}`;
      this.http.post<any>(url, this.loginForm.value)
        .subscribe({
          next: (response) => {
            const token = response.data.accessToken; // Verifique se o token está aqui
            if (token) {
              localStorage.setItem('token', token);
              this.router.navigate(['/dashboard']); // Navegação para o dashboard
              this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
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

