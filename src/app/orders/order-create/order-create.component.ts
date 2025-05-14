import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentMethod } from '../../interfaces/enums.interface';
import { CreateOrderDto, CreateOrderItemDto } from '../../interfaces/order.interface';
import { JwtDecoder } from '../../utils/jwt-decoder';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order-create',
  standalone: false,
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.css'
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  paymentMethods = Object.values(PaymentMethod);
  products: any[] = [];
  totalAmount: number = 0;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef 

  ) {
    this.orderForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.maxLength(255)]],
      billingAddress: ['', [Validators.required, Validators.maxLength(255)]],
      paymentMethod: ['', Validators.required],
      orderItems: this.fb.array([this.createOrderItem()])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToOrderItemsChanges();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.data;
        this.isLoading = false;
        // É bom recalcular aqui caso haja itens já no formulário e os produtos acabaram de carregar
        this.calculateTotalAmount();
        this.cdr.detectChanges(); // Importante após atualizações assíncronas
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar os produtos.', 'Fechar', { duration: 5000 });
        console.error('Erro ao carregar os produtos:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Garante que a UI reflita o estado de erro/loading
      }
    });
  }

  subscribeToOrderItemsChanges(): void {
    this.orderItems.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.orderItems.controls.reduce((sum, item) => {
      const productId = item.get('productId')?.value;
      const quantity = +item.get('quantity')?.value || 0;
      const product = this.products.find(p => p.uuid === productId);
      const price = product ? Number(product.price) : 0;
      return sum + (quantity * price);
    }, 0);
    this.cdr.detectChanges();
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addOrderItem(): void {
    this.orderItems.push(this.createOrderItem());
    this.cdr.detectChanges();
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);
    this.calculateTotalAmount();
    this.cdr.detectChanges();
  }

  paymentMethodMap: { [key: string]: number } = {
    'CreditCard': PaymentMethod.CreditCard,
    'DebitCard': PaymentMethod.DebitCard,
    'Cash': PaymentMethod.Cash,
    'Pix': PaymentMethod.Pix
  };

  onSubmit(): void {
    if (this.orderForm.valid) {
      const selectedPaymentMethod = this.orderForm.get('paymentMethod')?.value;
      const paymentMethodToSend = this.paymentMethodMap[selectedPaymentMethod];

      const createOrderDto: CreateOrderDto = {
        ...this.orderForm.value,
        paymentMethod: paymentMethodToSend,
        createByUserUuid: this.getUserId(),
        orderItems: this.orderItems.value.map((item: { productId: string; quantity: string }) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity, 10)
        }))
      };

      this.orderService.createOrder(createOrderDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Pedido criado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/client/orders']);
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

  getUnitPrice(productId: string): number {
    if (!productId || !this.products.length) return 0;
    const product = this.products.find(p => p.uuid === productId);
    return product ? Number(product.price) : 0;
  }

  getItemTotal(item: FormGroup): number { // 'item' aqui é o FormGroup de um orderItem
    const productId = item.get('productId')?.value;
    const quantity = +item.get('quantity')?.value || 0; // O '+' converte para número
    const unitPrice = this.getUnitPrice(productId);
    return unitPrice * quantity;
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = new JwtDecoder().decodeToken(token);
      return decodedToken?.sub;
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/client/orders']);
  }

  getOrderItem(index: number): FormGroup {
    return this.orderItems.at(index) as FormGroup;
  }
}
