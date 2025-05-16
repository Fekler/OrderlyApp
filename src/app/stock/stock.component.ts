import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ProductDto, CreateProductDto, UpdateProductDto } from '../interfaces/product.interface'; 
import { ApiResponse } from '../interfaces/api-response.interface';

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  products: ProductDto[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  showUuidColumn: boolean = false;
  displayedColumns: string[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
          this.displayedColumns = this.getDisplayedColumns(); // Defina as colunas após carregar os dados
        } else {
          this.errorMessage = response.message || 'Erro ao carregar produtos.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar produtos.';
        console.error('Erro:', error);
        this.isLoading = false;
      }
    });
  }

  getDisplayedColumns(): string[] {
    const columns = [];
    if (this.showUuidColumn) {
      columns.push('uuid');
    }
    columns.push('name', 'description', 'price', 'quantity', 'category', 'actions');
    return columns;
  }
  goToEditProduct(uuid: string): void {
    this.router.navigate(['/products', uuid, 'edit']);
  }
  goToCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }
}
