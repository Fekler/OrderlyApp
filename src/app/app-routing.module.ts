import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderCreateComponent } from './orders/order-create/order-create.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { StockComponent } from './stock/stock.component';
import { UsersComponent } from './users/users.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { ReportsComponent } from './reports/reports.component';
import { VendedorGuard } from './guards/vendedor.guard';
import { ClientGuard } from './guards/client.guard'; // Importe o guard do cliente


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/create', component: ProductCreateComponent },
  { path: 'products/:uuid/edit', component: ProductCreateComponent },

  {
    path: 'orders',
    component: OrdersComponent,
    children: [
      { path: 'create', component: OrderCreateComponent },
      { path: 'list', component: OrderListComponent },
      { path: ':id', component: OrderDetailComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  //{ path: 'orders/create', component: OrderCreateComponent, canActivate: [ClientGuard] },
  { path: 'client/orders', component: OrderListComponent, canActivate: [ClientGuard] }, 
  { path: 'order-list', component: OrderListComponent, canActivate: [VendedorGuard] }, 
  { path: 'stock', component: StockComponent, canActivate: [VendedorGuard] }, 
  { path: 'users', component: UsersComponent },
  { path: 'users/create', component: UserCreateComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Defina /login como a rota padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
