import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private location: Location 
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.minLength(1)],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const uuid = params.get('uuid');
        if (uuid) {
          this.isEditMode = true;
          return this.productService.getProduct(uuid);
        } else {
          this.isEditMode = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue(product.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Erro ao carregar os detalhes do produto.', 'Fechar', { duration: 5000 });
        console.error('Erro ao carregar os detalhes do produto:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const uuid = this.route.snapshot.paramMap.get('uuid');
      if (uuid) {
        this.productForm.value.uuid = uuid; 
        this.productService.updateProduct(uuid, this.productForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/stock']);
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Erro ao atualizar o produto.', 'Fechar', { duration: 5000 });
            console.error('Erro ao atualizar o produto:', error);
          }
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Produto criado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/stock']);
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Erro ao criar o produto.', 'Fechar', { duration: 5000 });
            console.error('Erro ao criar o produto:', error);
          }
        });
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  deleteProduct(): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const uuid = this.route.snapshot.paramMap.get('uuid');
      if (uuid) {
        this.productService.deleteProduct(uuid).subscribe({
          next: (response) => {
            this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/stock']);
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Erro ao excluir o produto.', 'Fechar', { duration: 5000 });
            console.error('Erro ao excluir o produto:', error);
          }
        });
      }
    }
  }
}
