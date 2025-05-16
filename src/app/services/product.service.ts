import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ProductDto, CreateProductDto, UpdateProductDto } from '../interfaces/product.interface'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiBaseUrl}/api/v1/Products`; 

  constructor(private http: HttpClient) { }

  getProduct(uuid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.apiUrl}/${uuid}`; 
    return this.http.get(url, { headers });
  }

  getProducts(): Observable<ApiResponse<ProductDto[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<ProductDto[]>>(this.apiUrl, { headers });
  }

  updateProduct(uuid: string, product: UpdateProductDto): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.apiUrl}/${uuid}`; 

    return this.http.put(url, product, { headers });
  }

  createProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, product, { headers });
  }

  deleteProduct(uuid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete(url, { headers });
  }
}
