import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="max-w-7xl mx-auto px-10 py-12 min-h-[60vh]">
      <div class="mb-10 text-left border-b border-gray-200 dark:border-gray-800 pb-6 flex justify-between items-end">
        <h1 class="text-3xl font-extrabold">Shopping Cart</h1>
        @if (cartItems().length > 0) {
          <button (click)="cartService.clearCart()" class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Clear Cart</button>
        }
      </div>

      @if (cartItems().length === 0) {
        <div class="card-theme rounded-2xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
             <mat-icon class="text-[48px] w-[48px] h-[48px] text-slate-400">remove_shopping_cart</mat-icon>
          </div>
          <h2 class="text-xl font-bold mb-3">Your Cart is Empty</h2>
          <p class="text-slate-500 text-sm mb-8">You haven't added any items to your shopping cart yet.</p>
          <a routerLink="/shop" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            Browse Products
          </a>
        </div>
      } @else {
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Cart Items -->
          <div class="w-full lg:w-2/3 space-y-4">
            @for (item of cartItems(); track item.id) {
              <div class="card-theme rounded-2xl p-4 flex items-center gap-6 shadow-sm relative group">
                <div class="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-xl p-2 flex-shrink-0 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                  <img [src]="item.thumbnail" [alt]="item.title" class="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" crossorigin="anonymous" referrerpolicy="no-referrer" />
                </div>
                
                <div class="flex-grow text-left w-full">
                  <div class="text-[10px] text-blue-600 mb-1 font-semibold uppercase tracking-wider">{{ item.category }}</div>
                  <h3 class="font-bold text-sm mb-2 line-clamp-1" [title]="item.title">{{ item.title }}</h3>
                  <div class="flex items-center gap-2 mb-4">
                    @if (item.discountPercentage > 0) {
                       <span class="text-lg font-extrabold">{{ (item.price * (1 - item.discountPercentage / 100)) | currency:'USD' }}</span>
                       <span class="text-[10px] text-slate-400 line-through">{{ item.price | currency:'USD' }}</span>
                    } @else {
                       <span class="text-lg font-extrabold">{{ item.price | currency:'USD' }}</span>
                    }
                  </div>
                  
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button (click)="updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><mat-icon class="text-[16px]">remove</mat-icon></button>
                      <span class="w-10 text-center font-bold text-sm">{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><mat-icon class="text-[16px]">add</mat-icon></button>
                    </div>
                  </div>
                </div>

                <button (click)="removeItem(item.id)" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white dark:hover:bg-red-500 z-10 border border-red-100 dark:border-red-900/50">
                  <mat-icon class="text-[16px] w-[16px] h-[16px] leading-none">close</mat-icon>
                </button>
              </div>
            }
          </div>

          <!-- Order Summary -->
          <div class="w-full lg:w-1/3">
            <div class="card-theme p-6 rounded-2xl sticky top-28 shadow-sm">
              <h2 class="text-lg font-bold mb-6 text-left border-b border-gray-100 dark:border-gray-800 pb-4">Order Summary</h2>
              
              <div class="space-y-4 mb-6 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span class="font-bold">{{ cartTotal() | currency:'USD' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Shipping</span>
                  <span class="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded text-xs uppercase">Free</span>
                </div>
                <div class="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                  <span class="text-base font-bold">Total</span>
                  <span class="font-extrabold text-xl text-blue-600">{{ cartTotal() | currency:'USD' }}</span>
                </div>
              </div>
              
              <a routerLink="/checkout" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm text-center block">
                Proceed to Checkout
              </a>
              
              <div class="mt-4 text-center flex items-center justify-center gap-1 text-slate-400">
                <mat-icon class="text-[14px]">lock</mat-icon>
                <span class="text-[10px] uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class CartComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  updateQuantity(id: number, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }
}
