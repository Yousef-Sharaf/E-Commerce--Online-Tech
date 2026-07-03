import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="max-w-7xl mx-auto px-10 py-12 min-h-[60vh]">
      <div class="mb-10 text-left border-b border-gray-200 dark:border-gray-800 pb-6 flex justify-between items-end">
        <h1 class="text-3xl font-extrabold">My Wishlist</h1>
        @if (wishlistItems().length > 0) {
          <button (click)="wishlistService.clearWishlist()" class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Clear All</button>
        }
      </div>

      @if (wishlistItems().length === 0) {
        <div class="card-theme rounded-2xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
             <mat-icon class="text-[48px] w-[48px] h-[48px]">favorite_border</mat-icon>
          </div>
          <h2 class="text-xl font-bold mb-3">Your Wishlist is Empty</h2>
          <p class="text-slate-500 text-sm mb-8">Save your favorite tech gadgets here to find them easily later.</p>
          <a routerLink="/shop" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            Discover Tech
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (item of wishlistItems(); track item.id) {
            <div class="card-theme rounded-2xl p-5 flex flex-col group relative h-full">
              <button (click)="removeItem(item.id)" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center transition-transform hover:scale-110 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 border border-red-100 dark:border-red-900/50">
                <mat-icon class="text-[16px]">close</mat-icon>
              </button>

              <div class="relative bg-slate-100 dark:bg-white/5 rounded-xl h-48 mb-4 overflow-hidden flex items-center justify-center p-4 cursor-pointer" [routerLink]="['/product', item.id]">
                <img [src]="item.thumbnail" [alt]="item.title" class="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-300" crossorigin="anonymous" referrerpolicy="no-referrer" />
              </div>
              
              <div class="flex flex-col flex-1 text-left">
                <div class="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-1">{{ item.brand || item.category }}</div>
                <h3 class="text-sm font-bold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2 cursor-pointer" [routerLink]="['/product', item.id]">
                  {{ item.title }}
                </h3>
                
                <div class="mt-auto pt-4 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-lg font-extrabold">{{ (item.price * (1 - (item.discountPercentage || 0) / 100)) | currency:'USD' }}</span>
                  </div>
                  <button (click)="moveToCart(item)" class="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    <mat-icon class="text-[16px]">shopping_cart</mat-icon>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </main>
  `
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  wishlistItems = this.wishlistService.wishlistItems;

  removeItem(id: number) {
    this.wishlistService.removeFromWishlist(id);
  }

  moveToCart(item: any) {
    this.cartService.addToCart(item);
    this.wishlistService.removeFromWishlist(item.id);
  }
}
