import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 flex items-center justify-between px-10 py-4 glass-header border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        <!-- Left: Logo & Nav -->
        <nav class="flex items-center space-x-10">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              <mat-icon class="text-white text-sm">devices</mat-icon>
            </div>
            <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Online<span class="text-blue-600">Tech</span></span>
          </a>

          <ul class="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <li><a routerLink="/" routerLinkActive="text-blue-600 border-b-2 border-blue-600 pb-1" [routerLinkActiveOptions]="{exact: true}" class="hover:text-blue-600 transition-colors">Home</a></li>
            <li><a routerLink="/shop" routerLinkActive="text-blue-600 border-b-2 border-blue-600 pb-1" class="hover:text-blue-600 transition-colors">Shop</a></li>
            @if (authService.hasRole('Admin')) {
                <li><a routerLink="/admin" routerLinkActive="text-blue-600 border-b-2 border-blue-600 pb-1" class="hover:text-blue-600 transition-colors">Admin</a></li>
            }
          </ul>
        </nav>
        
        <div class="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" placeholder="Search products..." class="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-full py-2 pl-4 pr-10 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400">
            <button (click)="onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center">
                <mat-icon class="text-[20px]">search</mat-icon>
            </button>
        </div>

        <!-- Right: Icons & Actions -->
        <div class="flex items-center space-x-6 shrink-0 relative">
          <button (click)="themeService.toggleTheme()" class="p-2 text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center">
            @if (themeService.isDarkMode()) {
              <mat-icon>light_mode</mat-icon>
            } @else {
              <mat-icon>dark_mode</mat-icon>
            }
          </button>
          
          <a routerLink="/wishlist" class="relative p-2 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors">
            <mat-icon>favorite_border</mat-icon>
            @if (wishlistCount() > 0) {
              <span class="absolute top-0 right-0 flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                {{ wishlistCount() }}
              </span>
            }
          </a>

          <a routerLink="/cart" class="relative p-2 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-colors">
            <mat-icon>shopping_cart</mat-icon>
            @if (cartCount() > 0) {
              <span class="absolute top-0 right-0 flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-full border-2 border-white dark:border-gray-900">
                {{ cartCount() }}
              </span>
            }
          </a>
          
          @if (authService.isAuthenticated()) {
              <div class="relative group cursor-pointer">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-400 font-bold">{{ authService.currentUser()?.firstName?.[0] || 'U' }}</span>
                    </div>
                  </div>
                  
                  <div class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 hidden group-hover:block z-50">
                     <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                         <p class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
                         <p class="text-xs text-slate-500 truncate">{{ authService.currentUser()?.email }}</p>
                     </div>
                     @if (authService.hasRole('Admin')) {
                         <a routerLink="/admin" class="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 flex items-center gap-2">
                             <mat-icon class="text-[18px]">dashboard</mat-icon> Dashboard
                         </a>
                     }
                     <a class="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 flex items-center gap-2">
                         <mat-icon class="text-[18px]">person</mat-icon> Profile
                     </a>
                     <a class="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 flex items-center gap-2">
                         <mat-icon class="text-[18px]">receipt_long</mat-icon> Orders
                     </a>
                     <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                         <mat-icon class="text-[18px]">logout</mat-icon> Sign Out
                     </button>
                  </div>
              </div>
          } @else {
              <a routerLink="/login" class="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Sign In</a>
          }
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  router = inject(Router);
  
  searchQuery = '';
  
  cartCount = this.cartService.cartCount;
  wishlistCount = this.wishlistService.wishlistCount;

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery } });
      this.searchQuery = '';
    }
  }

  logout() {
      this.authService.logout();
  }
}
