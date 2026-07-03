import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatIconModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Admin Header -->
      <header class="flex items-center justify-between px-10 py-4 glass-header border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
        <!-- Left -->
        <div class="flex items-center space-x-10">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              <mat-icon class="text-white text-[20px]">admin_panel_settings</mat-icon>
            </div>
            <span class="text-xl font-bold tracking-tight">Online<span class="text-blue-600">Tech</span></span>
          </div>
          
          <div class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a routerLink="/" class="hover:text-blue-600 transition-colors">Home</a>
            <a routerLink="/shop" class="hover:text-blue-600 transition-colors">Shop</a>
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
            <span class="text-xs font-bold text-blue-700 dark:text-blue-400">Admin</span>
          </div>
          <button class="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
            <mat-icon class="text-[20px]">notifications</mat-icon>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
          </button>
          
          <div class="relative group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm flex items-center justify-center">
                 <span class="text-blue-600 font-bold text-sm">{{ authService.currentUser()?.firstName?.[0] || 'A' }}</span>
              </div>
              <div class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 hidden group-hover:block z-50">
                   <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                       <p class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
                       <p class="text-xs text-slate-500 truncate">{{ authService.currentUser()?.email }}</p>
                   </div>
                   <button (click)="authService.logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                       <mat-icon class="text-[18px]">logout</mat-icon> Sign Out
                   </button>
              </div>
          </div>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-64 card-theme flex flex-col shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div class="p-6">
             <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 text-left">Overview</h3>
             <nav class="space-y-1 mb-8">
               <button (click)="view.set('dashboard')" [class.bg-blue-50]="view() === 'dashboard'" [class.dark:bg-blue-900/20]="view() === 'dashboard'" [class.text-blue-700]="view() === 'dashboard'" [class.dark:text-blue-400]="view() === 'dashboard'" [class.text-slate-600]="view() !== 'dashboard'" class="w-full flex items-center justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 <mat-icon class="mr-3 text-[20px]">dashboard</mat-icon>
                 <span>Dashboard</span>
               </button>
             </nav>
             <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 text-left">Store Management</h3>
             <nav class="space-y-1">
               <button (click)="view.set('products')" [class.bg-blue-50]="view() === 'products'" [class.dark:bg-blue-900/20]="view() === 'products'" [class.text-blue-700]="view() === 'products'" [class.dark:text-blue-400]="view() === 'products'" [class.text-slate-600]="view() !== 'products'" class="w-full flex items-center justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 <mat-icon class="mr-3 text-[20px]">inventory_2</mat-icon>
                 <span>Products</span>
               </button>
               <button (click)="view.set('categories')" [class.bg-blue-50]="view() === 'categories'" [class.dark:bg-blue-900/20]="view() === 'categories'" [class.text-blue-700]="view() === 'categories'" [class.dark:text-blue-400]="view() === 'categories'" [class.text-slate-600]="view() !== 'categories'" class="w-full flex items-center justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 <mat-icon class="mr-3 text-[20px]">category</mat-icon>
                 <span>Categories</span>
               </button>
               <button (click)="view.set('orders')" [class.bg-blue-50]="view() === 'orders'" [class.dark:bg-blue-900/20]="view() === 'orders'" [class.text-blue-700]="view() === 'orders'" [class.dark:text-blue-400]="view() === 'orders'" [class.text-slate-600]="view() !== 'orders'" class="w-full flex items-center justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 <mat-icon class="mr-3 text-[20px]">receipt_long</mat-icon>
                 <span>Orders</span>
               </button>
               <button (click)="view.set('customers')" [class.bg-blue-50]="view() === 'customers'" [class.dark:bg-blue-900/20]="view() === 'customers'" [class.text-blue-700]="view() === 'customers'" [class.dark:text-blue-400]="view() === 'customers'" [class.text-slate-600]="view() !== 'customers'" class="w-full flex items-center justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 <mat-icon class="mr-3 text-[20px]">people</mat-icon>
                 <span>Customers</span>
               </button>
             </nav>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 p-10 flex flex-col overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
          
          <div class="flex justify-between items-start mb-8">
             <div class="text-left">
               <h1 class="text-2xl font-bold mb-1">Admin <span class="text-blue-600">Dashboard</span></h1>
               <p class="text-slate-500 text-sm">Overview & Management</p>
             </div>
             
             <div>
               @if (view() === 'products') {
                 <button (click)="showAddProduct.set(true)" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm">
                   <mat-icon class="text-[18px] mr-1">add</mat-icon>
                   <span>Add Product</span>
                 </button>
               }
             </div>
          </div>

          @if (view() === 'dashboard') {
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div class="card-theme p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                     <div class="flex items-center justify-between mb-4">
                         <h3 class="text-slate-500 text-sm font-medium">Total Revenue</h3>
                         <div class="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
                             <mat-icon class="text-[20px]">attach_money</mat-icon>
                         </div>
                     </div>
                     <div class="text-3xl font-extrabold mb-1">$24,500.00</div>
                     <p class="text-sm text-green-600 flex items-center"><mat-icon class="text-[16px] mr-1">trending_up</mat-icon> +12% from last month</p>
                 </div>
                 <div class="card-theme p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                     <div class="flex items-center justify-between mb-4">
                         <h3 class="text-slate-500 text-sm font-medium">Orders</h3>
                         <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center">
                             <mat-icon class="text-[20px]">shopping_bag</mat-icon>
                         </div>
                     </div>
                     <div class="text-3xl font-extrabold mb-1">156</div>
                     <p class="text-sm text-green-600 flex items-center"><mat-icon class="text-[16px] mr-1">trending_up</mat-icon> +5% from last month</p>
                 </div>
                 <div class="card-theme p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                     <div class="flex items-center justify-between mb-4">
                         <h3 class="text-slate-500 text-sm font-medium">Customers</h3>
                         <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full flex items-center justify-center">
                             <mat-icon class="text-[20px]">group</mat-icon>
                         </div>
                     </div>
                     <div class="text-3xl font-extrabold mb-1">1,240</div>
                     <p class="text-sm text-green-600 flex items-center"><mat-icon class="text-[16px] mr-1">trending_up</mat-icon> +18% from last month</p>
                 </div>
                 <div class="card-theme p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                     <div class="flex items-center justify-between mb-4">
                         <h3 class="text-slate-500 text-sm font-medium">Products</h3>
                         <div class="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full flex items-center justify-center">
                             <mat-icon class="text-[20px]">inventory_2</mat-icon>
                         </div>
                     </div>
                     <div class="text-3xl font-extrabold mb-1">45</div>
                     <p class="text-sm text-slate-400">Total active products</p>
                 </div>
             </div>
          } @else if (view() === 'products') {
              @if (showAddProduct()) {
                 <div class="card-theme rounded-2xl shadow-sm p-8 text-left max-w-4xl border border-gray-100 dark:border-gray-800">
                     <div class="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                         <h2 class="text-lg font-bold">Add New Product</h2>
                         <button (click)="showAddProduct.set(false)" class="text-slate-400 hover:text-slate-600"><mat-icon>close</mat-icon></button>
                     </div>
                     <form [formGroup]="productForm" class="space-y-6">
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div class="space-y-1">
                                 <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
                                 <input formControlName="name" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                             </div>
                             <div class="space-y-1">
                                 <label class="text-sm font-medium text-slate-700 dark:text-slate-300">SKU</label>
                                 <input formControlName="sku" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                             </div>
                             <div class="space-y-1">
                                 <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                                 <select formControlName="category" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none">
                                     <option value="smartphones">Smartphones</option>
                                     <option value="laptops">Laptops</option>
                                     <option value="accessories">Accessories</option>
                                 </select>
                             </div>
                             <div class="space-y-1">
                                 <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Brand</label>
                                 <input formControlName="brand" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                             </div>
                             <div class="space-y-1">
                                 <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
                                 <input formControlName="price" type="number" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                             </div>
                             <div class="space-y-1">
                                 <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Stock Quantity</label>
                                 <input formControlName="stock" type="number" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                             </div>
                         </div>
                         <div class="space-y-1">
                             <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                             <textarea formControlName="description" rows="4" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
                         </div>
                         <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
                             <mat-icon class="text-[48px] w-[48px] h-[48px] text-slate-400 mb-2">cloud_upload</mat-icon>
                             <p class="font-medium text-slate-600 dark:text-slate-300 mb-1">Drag and drop product images here</p>
                             <p class="text-xs text-slate-500">Supports JPG, PNG, WEBP. Max size 5MB.</p>
                         </div>
                         <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                             <button type="button" (click)="showAddProduct.set(false)" class="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                             <button type="button" (click)="showAddProduct.set(false)" class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm">Save Product</button>
                         </div>
                     </form>
                 </div>
              } @else {
                  <div class="card-theme rounded-2xl shadow-sm flex-1 flex flex-col p-6 border border-gray-100 dark:border-gray-800">
                      <div class="flex justify-start mb-6">
                        <div class="relative w-full max-w-sm">
                          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</mat-icon>
                          <input type="text" placeholder="Search product..." class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-left outline-none transition-all placeholder:text-slate-400"/>
                        </div>
                      </div>
                      
                      <div class="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-10">
                         <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                           <mat-icon class="text-[32px]">inventory_2</mat-icon>
                         </div>
                         <h3 class="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">No Products Found</h3>
                         <p class="text-slate-400 text-sm">Add your first products to get started.</p>
                      </div>
                  </div>
              }
          } @else if (view() === 'orders') {
              <div class="card-theme rounded-2xl shadow-sm flex-1 flex flex-col p-6 border border-gray-100 dark:border-gray-800">
                  <div class="flex justify-between items-center mb-6">
                    <div class="relative w-full max-w-sm">
                      <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</mat-icon>
                      <input type="text" placeholder="Search by customer..." class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-left outline-none transition-all placeholder:text-slate-400"/>
                    </div>
                    
                    <div class="flex gap-2">
                      <button class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-md text-xs font-bold">All</button>
                      <button class="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-gray-700 rounded-md text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Pending</button>
                      <button class="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-gray-700 rounded-md text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Confirmed</button>
                    </div>
                  </div>
                  
                  <div class="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-10">
                     <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                       <mat-icon class="text-[32px]">receipt_long</mat-icon>
                     </div>
                     <p class="text-slate-400 text-sm">No orders yet</p>
                  </div>
              </div>
          } @else if (view() === 'customers') {
              <div class="card-theme rounded-2xl shadow-sm flex-1 flex flex-col p-6 border border-gray-100 dark:border-gray-800">
                  <div class="flex justify-between items-center mb-6">
                    <div class="relative w-full max-w-sm">
                      <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</mat-icon>
                      <input type="text" placeholder="Search customers..." class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-left outline-none transition-all placeholder:text-slate-400"/>
                    </div>
                  </div>
                  
                  <div class="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-10">
                     <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                       <mat-icon class="text-[32px]">people</mat-icon>
                     </div>
                     <p class="text-slate-400 text-sm">Customer list is empty</p>
                  </div>
              </div>
          }

        </main>
      </div>
    </div>
  `
})
export class AdminComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  view = signal<'dashboard' | 'products' | 'orders' | 'customers' | 'categories'>('dashboard');
  showAddProduct = signal(false);

  productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      category: ['smartphones', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      description: ['']
  });
}
