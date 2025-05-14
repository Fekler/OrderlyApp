import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentMethod } from '../../interfaces/enums.interface';
import { CreateOrderDto, CreateOrderItemDto } from '../../interfaces/order.interface';
import { JwtDecoder } from '../../utils/jwt-decoder'; 

@Component({
  selector: 'app-order-create',
  standalone: false,
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.css'
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.maxLength(255)]],
      billingAddress: ['', [Validators.required, Validators.maxLength(255)]],
      paymentMethod: ['', Validators.required],
      orderItems: this.fb.array([this.createOrderItem()])
    });
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addOrderItem(): void {
    this.orderItems.push(this.createOrderItem());
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const createOrderDto: CreateOrderDto = {
        ...this.orderForm.value,
        createByUserUuid: this.getUserId(),
        orderItems: this.orderItems.value.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      this.orderService.createOrder(createOrderDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Pedido criado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/client/orders']); // Redirecionar para a lista de pedidos
          } else {
            this.snackBar.open(`Erro ao criar pedido: ${response.message}`, 'Fechar', { duration: 5000 });
          }
        },
        error: (error) => {
          console.error('Erro ao criar pedido:', error);
          this.snackBar.open('Erro inesperado ao criar pedido.', 'Fechar', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
    }
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = new JwtDecoder().decodeToken(token);
      return decodedToken?.sub; // Supondo que o ID do usuário esteja na propriedade 'sub'
    }
    return ''; // Ou trate o caso em que o token não está presente
  }

  goBack(): void {
    this.router.navigate(['/client/orders']);
  }
}
