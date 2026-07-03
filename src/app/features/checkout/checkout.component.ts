import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="max-w-5xl mx-auto px-10 py-12 min-h-[70vh]">
      <div class="mb-10 text-center border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 class="text-3xl font-extrabold mb-2">Checkout</h1>
        <p class="text-slate-500">Complete your order securely.</p>
      </div>

      @if (orderPlaced()) {
        <div class="card-theme rounded-3xl p-16 text-center shadow-lg border-t-4 border-t-emerald-500 max-w-2xl mx-auto">
          <div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
             <mat-icon class="text-[48px] text-emerald-500">check_circle</mat-icon>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Order Placed Successfully!</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-8 mx-auto">Thank you for your purchase. We will send you an email confirmation shortly.</p>
          <a routerLink="/shop" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold inline-flex transition-transform hover:scale-105 shadow-md">
            Continue Shopping
          </a>
        </div>
      } @else if (cartService.cartItems().length === 0) {
        <div class="text-center py-20">
            <h2 class="text-xl font-bold mb-4">Your cart is empty</h2>
            <a routerLink="/shop" class="text-blue-600 hover:underline font-medium">Return to Shop</a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Form -->
            <div class="space-y-8">
                <div class="card-theme rounded-2xl p-6 shadow-sm">
                    <h3 class="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                        <mat-icon class="text-blue-600">local_shipping</mat-icon> Shipping Details
                    </h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"/>
                            <input type="text" placeholder="Last Name" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"/>
                        </div>
                        <input type="email" placeholder="Email Address" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"/>
                        <input type="text" placeholder="Address" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"/>
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="City" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"/>
                            <input type="text" placeholder="Postal Code" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"/>
                        </div>
                    </div>
                </div>

                <div class="card-theme rounded-2xl p-6 shadow-sm">
                    <h3 class="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                        <mat-icon class="text-blue-600">payment</mat-icon> Payment Method
                    </h3>
                    <div class="space-y-3 text-sm">
                        <label class="flex items-center gap-3 p-4 border border-blue-500 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 cursor-pointer">
                            <input type="radio" name="payment" checked class="accent-blue-600 w-4 h-4"/>
                            <span class="font-medium text-slate-900 dark:text-white">Credit Card</span>
                        </label>
                        <label class="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <input type="radio" name="payment" class="accent-blue-600 w-4 h-4"/>
                            <span class="font-medium text-slate-900 dark:text-white">PayPal</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div>
                <div class="card-theme rounded-2xl p-8 sticky top-28 shadow-sm">
                    <h3 class="font-bold text-lg mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">Order Summary</h3>
                    
                    <div class="space-y-4 mb-6">
                        @for (item of cartService.cartItems(); track item.id) {
                            <div class="flex justify-between items-center text-sm">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded flex items-center justify-center border border-gray-100 dark:border-gray-700 p-1">
                                        <img [src]="item.thumbnail" class="max-w-full max-h-full mix-blend-multiply dark:mix-blend-normal object-contain" crossorigin="anonymous" referrerpolicy="no-referrer"/>
                                    </div>
                                    <span class="text-slate-600 dark:text-slate-400 line-clamp-1 max-w-[150px]"><span class="font-bold text-slate-900 dark:text-white">{{ item.quantity }}x</span> {{ item.title }}</span>
                                </div>
                                <span class="font-medium whitespace-nowrap">{{ ((item.price * (1 - (item.discountPercentage || 0) / 100)) * item.quantity) | currency:'USD' }}</span>
                            </div>
                        }
                    </div>
                    
                    <div class="space-y-3 text-sm border-t border-gray-200 dark:border-gray-800 pt-6 mb-6">
                        <div class="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span class="font-medium text-slate-900 dark:text-white">{{ cartService.cartTotal() | currency:'USD' }}</span>
                        </div>
                        <div class="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Shipping</span>
                            <span class="font-bold text-emerald-600 uppercase text-[10px] tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Free</span>
                        </div>
                        <div class="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                            <span class="text-base font-bold">Total</span>
                            <span class="font-extrabold text-2xl text-blue-600">{{ cartService.cartTotal() | currency:'USD' }}</span>
                        </div>
                    </div>

                    <button (click)="placeOrder()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                        <mat-icon>lock</mat-icon> Place Order
                    </button>
                    <p class="text-center text-xs text-slate-400 mt-4">Secure encrypted payment processing.</p>
                </div>
            </div>
        </div>
      }
    </main>
  `
})
export class CheckoutComponent {
  cartService = inject(CartService);
  orderPlaced = signal(false);

  placeOrder() {
    if (this.cartService.cartItems().length > 0) {
      this.orderPlaced.set(true);
      this.cartService.clearCart();
    }
  }
}
