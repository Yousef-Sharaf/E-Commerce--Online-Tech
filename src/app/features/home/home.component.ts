import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <section class="py-10">
      <div class="max-w-7xl mx-auto px-10">
        <div class="relative bg-slate-900 dark:bg-[#07111F] rounded-[2rem] overflow-hidden min-h-[400px] shadow-xl flex items-center px-12 border border-slate-800">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent"></div>
          
          <div class="relative z-10 max-w-lg text-left w-full">
            <span class="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full mb-4 uppercase tracking-widest">New Arrivals</span>
            <h1 class="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">Premium Tech <br/>Accessories</h1>
            <p class="text-slate-300 text-sm md:text-base mb-8">Discover top-tier gadgets from global brands at unbeatable prices.</p>
            <div class="flex items-center gap-4">
              <a routerLink="/shop" class="px-6 py-3 bg-white text-slate-900 font-bold rounded-full text-sm hover:bg-slate-100 transition-transform active:scale-95 shadow-lg">
                Shop Now
              </a>
              <a routerLink="/shop" class="px-6 py-3 bg-transparent border border-slate-500 text-white font-bold rounded-full text-sm hover:bg-white/10 transition-colors">
                Explore Deals
              </a>
            </div>
          </div>
          
          <div class="ml-auto hidden lg:flex opacity-40 absolute right-12 mix-blend-screen">
             <mat-icon class="text-[200px] w-[200px] h-[200px] text-white">headset_mic</mat-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Bar -->
    <section class="py-10 border-y border-gray-200 dark:border-gray-800 shrink-0">
      <div class="max-w-7xl mx-auto px-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x dark:divide-gray-800 divide-gray-200">
          <div class="flex flex-col items-center py-4 md:py-0">
            <mat-icon class="text-blue-600 mb-2">local_shipping</mat-icon>
            <span class="text-lg font-extrabold mb-1">Free Shipping</span>
            <span class="text-slate-500 text-xs font-semibold tracking-widest uppercase">On orders over $50</span>
          </div>
          <div class="flex flex-col items-center py-4 md:py-0">
            <mat-icon class="text-blue-600 mb-2">verified_user</mat-icon>
            <span class="text-lg font-extrabold mb-1">100% Genuine</span>
            <span class="text-slate-500 text-xs font-semibold tracking-widest uppercase">Authentic products</span>
          </div>
          <div class="flex flex-col items-center py-4 md:py-0">
            <mat-icon class="text-blue-600 mb-2">support_agent</mat-icon>
            <span class="text-lg font-extrabold mb-1">24/7 Support</span>
            <span class="text-slate-500 text-xs font-semibold tracking-widest uppercase">Dedicated help desk</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-10">
        <div class="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 class="text-2xl font-bold">Featured Products</h2>
          <a routerLink="/shop" class="text-sm font-semibold text-blue-600 hover:underline flex items-center">
            View All <mat-icon class="text-[18px]">arrow_right_alt</mat-icon>
          </a>
        </div>
        
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product" (addToCart)="onAddToCart($event)"></app-product-card>
            }
          </div>
        }
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 bg-slate-50 dark:bg-[#0A1622]">
      <div class="max-w-7xl mx-auto px-10">
        <h2 class="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (cat of ['smartphones', 'laptops', 'tablets', 'mobile-accessories']; track cat) {
            <a [routerLink]="['/shop']" [queryParams]="{category: cat}" class="card-theme rounded-2xl p-8 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-600 transition-colors">
              <mat-icon class="text-[48px] w-[48px] h-[48px] text-slate-400 group-hover:text-blue-600 transition-colors mb-4">
                {{ cat === 'smartphones' ? 'smartphone' : cat === 'laptops' ? 'laptop_mac' : cat === 'tablets' ? 'tablet_mac' : 'headphones' }}
              </mat-icon>
              <span class="font-bold uppercase tracking-wider text-xs">{{ cat.replace('-', ' ') }}</span>
            </a>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private cartService = inject(CartService);

  featuredProducts = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.apiService.getProducts().subscribe({
      next: (products) => {
        // Just take a few high rated products for home page
        const featured = products.filter(p => p.rating > 4.5).slice(0, 4);
        this.featuredProducts.set(featured.length > 0 ? featured : products.slice(0, 4));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
