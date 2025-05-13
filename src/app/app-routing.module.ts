import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

// Remova a importação do AppRoutingModule

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderCreateComponent } from './orders/order-create/order-create.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { StockComponent } from './stock/stock.component';
import { UsersComponent } from './users/users.component';
import { ReportsComponent } from './reports/reports.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router'; // Importe RouterModule e Routes aqui
import { MatCardModule } from '@angular/material/card'; // Importe MatCardModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importe MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importe MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importe MatButtonModule
import { ReactiveFormsModule } from '@angular/forms'; // Importe ReactiveFormsModule


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/create', component: ProductCreateComponent },
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
  { path: 'stock', component: StockComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/create', component: UserCreateComponent },
  { path: 'reports', component: ReportsComponent },
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Definindo /login como a rota padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
