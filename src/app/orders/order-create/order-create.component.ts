import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentMethod } from '../../interfaces/enums.interface';
import { CreateOrderDto, CreateOrderItemDto } from '../../interfaces/order.interface';
import { JwtDecoder } from '../../utils/jwt-decoder';
import { ProductService } from '../../services/product.service';
import { createUniqueProductValidator, createMaxStockValidator } from '../../validators/product.validator'; // Exemplo de caminho

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
    if (this.orderItems.length === 0) {
      this.addOrderItem();
    }
    this.subscribeToOrderItemsChanges();
  }


  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.data;
        this.isLoading = false;

        // Atualiza validadores dos itens existentes que dependem da lista de produtos
        this.orderItems.controls.forEach(itemGroup => {
          const productIdCtrl = itemGroup.get('productId');
          const quantityCtrl = itemGroup.get('quantity');

          if (productIdCtrl && quantityCtrl) { // Garante que os controles existem
            quantityCtrl.setValidators([
              Validators.required,
              Validators.min(1),
              createMaxStockValidator(() => this.products, () => productIdCtrl)
            ]);
            quantityCtrl.updateValueAndValidity({ emitEvent: false }); // emitEvent: false para evitar loops
          }
        });

        this.calculateTotalAmount();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar os produtos.', 'Fechar', { duration: 5000 });
        console.error('Erro ao carregar os produtos:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  getOrderItem(index: number): FormGroup {
    return this.orderItems.at(index) as FormGroup;
  }

  subscribeToOrderItemsChanges(): void {
    this.orderItems.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
      // Poderia ser necessário revalidar outros controles aqui em cenários complexos,
      // mas a maior parte deve ser tratada nas subscrições de valueChanges individuais dos controles.
    });
  }
  createOrderItem(): FormGroup {
    const newItemFormGroup = this.fb.group({
      productId: ['', [Validators.required]], // Validador uniqueProduct será adicionado abaixo
      quantity: [1, [Validators.required, Validators.min(1)]] // Validador maxStock será adicionado abaixo
    });

    const productIdControl = newItemFormGroup.get('productId');
    const quantityControl = newItemFormGroup.get('quantity');

    if (productIdControl) {
      // Adiciona validador de produto único
      productIdControl.setValidators([
        Validators.required,
        createUniqueProductValidator(() => this.orderItems) // Passa uma função para obter o FormArray
      ]);

      // Quando o produto muda, revalida a quantidade (para maxStock) e
      // os outros productIds (para duplicidade)
      productIdControl.valueChanges.subscribe(selectedProductId => {
        quantityControl?.updateValueAndValidity(); // Revalida a quantidade

        // Força a revalidação de outros productIds para checar duplicidade
        this.orderItems.controls.forEach(group => {
          if (group !== newItemFormGroup) { // Não revalida a si mesmo nesta lógica específica
            group.get('productId')?.updateValueAndValidity({ emitEvent: false });
          }
        });
        this.calculateTotalAmount(); // Recalcula o total, pois o preço unitário pode mudar
      });
    }

    if (quantityControl && productIdControl) {
      // Adiciona validador de estoque máximo
      quantityControl.setValidators([
        Validators.required,
        Validators.min(1),
        createMaxStockValidator(() => this.products, () => productIdControl) // Passa funções
      ]);
      // Não é necessário valueChanges aqui para quantity afetar productId diretamente,
      // mas calculateTotalAmount já é chamado no template (input) ou pelo valueChanges do FormArray.
    }
    return newItemFormGroup;
  }

  addOrderItem(): void {
    const newItem = this.createOrderItem();
    this.orderItems.push(newItem);
    // Após adicionar um novo item (vazio),
    // não deve afetar a validação de duplicidade dos outros imediatamente.
    // A validação de duplicidade ocorrerá quando um produto for selecionado no novo item.
    this.calculateTotalAmount();
    this.cdr.detectChanges();
  }

  removeOrderItem(index: number): void {
    const removedItemProductId = this.orderItems.at(index).get('productId')?.value;
    this.orderItems.removeAt(index);

    // Se um produto foi removido, outros itens que poderiam estar duplicados com ele
    // devem ser revalidados.
    if (removedItemProductId) {
      this.orderItems.controls.forEach(group => {
        group.get('productId')?.updateValueAndValidity({ emitEvent: false });
      });
    }
    this.calculateTotalAmount();
    this.cdr.detectChanges();
  }

  // ... (calculateTotalAmount, onSubmit, getUserId, goBack, getOrderItem permanecem) ...

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  getUnitPrice(productId: string): number {
    if (!productId || !this.products.length) return 0;
    const product = this.products.find(p => p.uuid === productId);
    return product ? Number(product.price) : 0;
  }

  getItemTotal(item: FormGroup): number {
    const productId = item.get('productId')?.value;
    const quantity = +item.get('quantity')?.value || 0; // '+' converte para número
    const unitPrice = this.getUnitPrice(productId);
    return unitPrice * quantity;
  }

  /**
   * Retorna a quantidade em estoque para um produto específico.
   * Usado para o atributo [max] no template.
   */
  getProductStock(productId: string): number | null {
    if (!productId || !this.products.length) {
      return null; // Retorna null se não houver produto ou ID, para não definir max="0" indevidamente
    }
    const product = this.products.find(p => p.uuid === productId);
    return product ? Number(product.quantity) : null;
  }

  /**
   * Verifica se um produto já foi selecionado em outro item do pedido.
   * Usado para desabilitar opções no select do template.
   */
  isProductSelectedElsewhere(productId: string, currentIndex: number): boolean {
    if (!productId) return false;
    return this.orderItems.controls.some((control, index) => {
      // Compara com outros itens (index diferente) que tenham o mesmo productId
      return index !== currentIndex && control.get('productId')?.value === productId;
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
  goBack(): void {
    this.router.navigate(['/client/orders']);
  }
}
