import { CanActivateFn } from '@angular/router';

export const vendedorGuard: CanActivateFn = (route, state) => {
  return true;
};
