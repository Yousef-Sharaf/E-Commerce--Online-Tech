import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="card-theme border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto px-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <!-- Brand -->
          <div class="text-left order-1 md:order-1">
            <h3 class="text-2xl font-extrabold mb-4 tracking-tight">Online<span class="text-blue-600">Tech</span></h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
              Your premier destination for luxury tech accessories and electronics.
            </p>
            <p class="italic text-slate-400 text-xs">
              "Selling The Most Luxurious Tech Accessories"
            </p>
          </div>

          <!-- Links -->
          <div class="text-left order-2 md:order-2">
            <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul class="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><a routerLink="/" class="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a routerLink="/shop" class="hover:text-blue-600 transition-colors">Shop</a></li>
              <li><a routerLink="/cart" class="hover:text-blue-600 transition-colors">Cart</a></li>
              <li><a routerLink="/admin" class="hover:text-blue-600 transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="text-left order-3 md:order-3">
            <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Contact Us</h4>
            <ul class="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
              <li class="flex items-center space-x-3">
                <mat-icon class="text-blue-600 text-[18px]">phone</mat-icon>
                <span>+1 (800) 123-4567</span>
              </li>
              <li class="flex items-center space-x-3">
                <mat-icon class="text-blue-600 text-[18px]">location_on</mat-icon>
                <span>Silicon Valley, CA</span>
              </li>
            </ul>
          </div>

        </div>

        <div class="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-slate-500 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="font-medium">© 2026 Online Tech. All rights reserved.</p>
          <div class="flex space-x-4">
             <button class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center hover:text-blue-600 transition-colors"><mat-icon class="text-[18px]">facebook</mat-icon></button>
             <button class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center hover:text-blue-600 transition-colors"><mat-icon class="text-[18px]">camera_alt</mat-icon></button>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
