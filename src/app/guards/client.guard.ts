import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtDecoder } from '../utils/jwt-decoder';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = new JwtDecoder().decodeToken(token);
      if (decodedToken && decodedToken.role === 'Client') {
        return true;
      }
    }
    this.router.navigate(['/login']); // Redireciona para o login se não for cliente
    return false;
  }
}
