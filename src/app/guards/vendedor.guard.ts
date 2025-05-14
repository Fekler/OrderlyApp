import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendedorGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        if (role === 'Seller') {
          return true;
        } else {
          this.router.navigate(['/dashboard']); // Redireciona para o dashboard se não for vendedor
          return false;
        }
      } catch (error) {
        this.router.navigate(['/login']); // Redireciona para o login em caso de erro
        return false;
      }
    } else {
      this.router.navigate(['/login']); // Redireciona para o login se não houver token
      return false;
    }
  }
}
