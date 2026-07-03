import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-theme rounded-2xl p-5 flex flex-col group relative h-full">
      <!-- Wishlist Toggle -->
      <button (click)="toggleWishlist($event)" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center transition-transform hover:scale-110 border border-gray-100 dark:border-gray-700">
        <mat-icon class="text-[18px]" [class.text-red-500]="inWishlist()" [class.text-slate-400]="!inWishlist()">
          {{ inWishlist() ? 'favorite' : 'favorite_border' }}
        </mat-icon>
      </button>

      <div class="relative bg-slate-100 dark:bg-white/5 rounded-xl h-48 mb-4 overflow-hidden flex items-center justify-center p-4 cursor-pointer" [routerLink]="['/product', product().id]">
        @if (product().discountPercentage > 0) {
          <div class="absolute top-3 left-3 bg-red-100 text-red-600 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm uppercase z-10">
            -{{ product().discountPercentage }}%
          </div>
        }
        <img [src]="product().thumbnail" [alt]="product().title" class="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal" crossorigin="anonymous" referrerpolicy="no-referrer" loading="lazy" />
      </div>
      
      <div class="flex flex-col flex-1 text-left cursor-pointer" [routerLink]="['/product', product().id]">
        <div class="flex items-center justify-between mb-1">
          <div class="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">{{ product().brand || product().category }}</div>
          <div class="flex items-center space-x-1 text-xs">
            <span class="text-yellow-400"><mat-icon class="text-[14px] w-[14px] h-[14px] leading-none">star</mat-icon></span>
            <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500">{{ product().rating }}</span>
          </div>
        </div>
        
        <h3 class="text-sm font-bold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2" [title]="product().title">
          {{ product().title }}
        </h3>
        
        <div class="mt-auto flex items-center justify-between pt-4">
          <div class="flex flex-col">
            @if (product().discountPercentage > 0) {
              <span class="text-[10px] text-slate-400 line-through">{{ product().price | currency:'USD' }}</span>
              <span class="text-lg font-extrabold text-slate-900 dark:text-white">{{ getDiscountedPrice() | currency:'USD' }}</span>
            } @else {
              <span class="text-lg font-extrabold text-slate-900 dark:text-white">{{ product().price | currency:'USD' }}</span>
            }
          </div>
          <button (click)="onAddToCart($event)" class="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm">
            <mat-icon class="text-[20px] w-[20px] h-[20px] leading-none">add_shopping_cart</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  wishlistService = inject(WishlistService);

  get inWishlist() {
    return () => this.wishlistService.isInWishlist(this.product().id);
  }

  getDiscountedPrice(): number {
    const p = this.product();
    return p.price * (1 - (p.discountPercentage || 0) / 100);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(this.product());
  }
}
