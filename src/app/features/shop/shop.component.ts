import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { CartService } from '../../core/services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductCardComponent, MatIconModule, FormsModule, TitleCasePipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col lg:flex-row max-w-7xl mx-auto py-10 px-10 gap-8">
      <!-- Sidebar -->
      <aside class="w-full lg:w-72 card-theme rounded-2xl p-6 flex flex-col space-y-8 shrink-0 self-start shadow-sm sticky top-28">
        <div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 text-left">Filter Products</h3>
          
          <div class="space-y-6">
            <!-- Search -->
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] w-[20px] h-[20px]">search</mat-icon>
              <input [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" type="text" placeholder="Search..." 
                     class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-left outline-none transition-all text-sm placeholder:text-slate-400"/>
            </div>

            <!-- Categories -->
            <div class="flex flex-col space-y-2 text-left">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select [(ngModel)]="selectedCategory" (ngModelChange)="applyFilters()" class="text-sm bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 focus:ring-blue-600 outline-none text-left appearance-none cursor-pointer">
                <option value="">All Categories</option>
                @for (cat of categories(); track cat) {
                  <option [value]="cat">{{ cat.replace('-', ' ') | titlecase }}</option>
                }
              </select>
            </div>

            <!-- Price Range (Mock) -->
            <div class="flex flex-col space-y-2 text-left">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Max Price</label>
              <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>$0</span>
                <span class="font-bold text-blue-600">{{ maxPrice | currency:'USD':'symbol':'1.0-0' }}</span>
              </div>
              <input type="range" min="0" max="2000" step="50" [(ngModel)]="maxPrice" (ngModelChange)="applyFilters()" class="w-full accent-blue-600"/>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 text-left">Popular Brands</h3>
          <div class="grid grid-cols-2 gap-2">
            @for (brand of ['Apple', 'Samsung', 'Dell', 'Asus']; track brand) {
              <button (click)="selectBrand(brand)" [class.bg-blue-50]="selectedBrand === brand" [class.dark:bg-blue-900/30]="selectedBrand === brand" [class.border-blue-500]="selectedBrand === brand" [class.text-blue-700]="selectedBrand === brand" [class.dark:text-blue-400]="selectedBrand === brand" class="px-3 py-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">{{ brand }}</button>
            }
          </div>
        </div>
        
        <div class="mt-auto pt-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-left border border-blue-100 dark:border-blue-900/50">
            <p class="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">Pro Membership</p>
            <p class="text-[11px] text-blue-600 dark:text-blue-300 leading-tight mb-3">Get free shipping and exclusive tech deals.</p>
            <button class="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Upgrade Now</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">All Products</h2>
          <div class="w-48">
            <select [(ngModel)]="sortOption" (ngModelChange)="applyFilters()" class="text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 focus:ring-blue-600 outline-none w-full text-left appearance-none cursor-pointer shadow-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
            @for (product of filteredProducts(); track product.id) {
              <app-product-card [product]="product" (addToCart)="onAddToCart($event)"></app-product-card>
            }
            @if (filteredProducts().length === 0) {
              <div class="col-span-full py-20 text-center text-slate-500 card-theme rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <mat-icon class="text-[64px] w-[64px] h-[64px] mb-4 text-slate-300 dark:text-slate-600">search_off</mat-icon>
                <p class="text-base font-medium">No products match your search</p>
                <button (click)="clearFilters()" class="mt-4 text-blue-600 text-sm font-semibold hover:underline">Clear Filters</button>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `
})
export class ShopComponent implements OnInit {
  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);

  searchQuery = '';
  selectedCategory = '';
  sortOption = 'newest';
  maxPrice = 2000;
  selectedBrand = '';

  ngOnInit() {
    this.apiService.getCategories().subscribe(cats => this.categories.set(cats));
    
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectBrand(brand: string) {
    if (this.selectedBrand === brand) {
      this.selectedBrand = '';
    } else {
      this.selectedBrand = brand;
    }
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.maxPrice = 2000;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.products();
    
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    if (this.selectedBrand) {
      filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === this.selectedBrand.toLowerCase());
    }

    filtered = filtered.filter(p => this.getDiscountedPrice(p) <= this.maxPrice);

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
    }
    
    if (this.sortOption === 'price-asc') {
      filtered.sort((a, b) => this.getDiscountedPrice(a) - this.getDiscountedPrice(b));
    } else if (this.sortOption === 'price-desc') {
      filtered.sort((a, b) => this.getDiscountedPrice(b) - this.getDiscountedPrice(a));
    } else if (this.sortOption === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // Newest (just reverse ID or keep as is)
      filtered.sort((a, b) => b.id - a.id);
    }
    
    this.filteredProducts.set(filtered);
  }

  private getDiscountedPrice(p: Product): number {
    return p.price * (1 - (p.discountPercentage || 0) / 100);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
