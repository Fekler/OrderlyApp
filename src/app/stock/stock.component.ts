import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  showUuidColumn: boolean = false;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.data; // AQUI ESTÁ A MUDANÇA
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar os produtos.';
        console.error('Erro ao carregar os produtos:', error);
        this.isLoading = false;
      }
    });
  }
  goToEditProduct(uuid: string): void {
    this.router.navigate(['/products', uuid, 'edit']);
  }
  goToCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }
}
