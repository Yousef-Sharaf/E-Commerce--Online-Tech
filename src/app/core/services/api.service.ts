import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com/products';
  
  private cache = new Map<string, any>();

  getProducts(): Observable<Product[]> {
    if (this.cache.has('all')) {
      return of(this.cache.get('all'));
    }
    const categories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
    const requests = categories.map(cat => this.http.get<{products: Product[]}>(`${this.baseUrl}/category/${cat}`));
    
    return forkJoin(requests).pipe(
      map(responses => responses.flatMap(r => r.products)),
      tap(products => this.cache.set('all', products))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return of(['smartphones', 'laptops', 'tablets', 'mobile-accessories']);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<{products: Product[]}>(`${this.baseUrl}/category/${category}`).pipe(
      map(res => res.products)
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<{products: Product[]}>(`${this.baseUrl}/search?q=${query}`).pipe(
      map(res => res.products.filter(p => ['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(p.category)))
    );
  }
}
