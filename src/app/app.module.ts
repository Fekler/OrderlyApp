import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor'; 
import { AuthService } from './services/auth.service'; 
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip'; 


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductsComponent,
    OrdersComponent,
    OrderCreateComponent,
    OrderListComponent,
    OrderDetailComponent,
    StockComponent,
    UsersComponent,
    ReportsComponent,
    UserCreateComponent,
    ProductCreateComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,



  ],
  providers: [
    provideHttpClient(),
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Registre o interceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
