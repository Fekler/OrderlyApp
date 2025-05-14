import { Injectable } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';





@Injectable() // Adicione o decorator Injectable
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            errorMessage = `Status: ${error.status} - Message: ${error.error.message}`;
          }

          if (error.error && error.error.error === 'invalid_token') {
            // Token is invalid or expired
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (error.error && error.error === 'insufficient_permissions') {
            // Insufficient permissions
            // You might want to handle this differently, e.g., show an error message
            console.error('Insufficient permissions:', errorMessage);
            // Optionally, you can navigate to a "forbidden" page or show a snackbar
            // this.router.navigate(['/forbidden']);
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            // Other 401 errors (e.g., authentication failed)
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(error);
      })
    );
  }
}
