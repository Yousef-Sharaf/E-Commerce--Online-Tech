import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
     <main class="max-w-7xl mx-auto px-10 py-12 min-h-[70vh]">
        @if (loading()) {
            <div class="flex items-center justify-center py-20">
              <mat-icon class="animate-spin text-[48px] text-blue-600">refresh</mat-icon>
            </div>
        } @else if (product()) {
            <!-- Breadcrumbs -->
            <nav class="flex text-sm text-slate-500 dark:text-slate-400 mb-8 items-center space-x-2">
                <a routerLink="/" class="hover:text-blue-600 transition-colors">Home</a>
                <mat-icon class="text-[16px]">chevron_right</mat-icon>
                <a [routerLink]="['/shop']" [queryParams]="{category: product()!.category}" class="hover:text-blue-600 transition-colors capitalize">{{ product()!.category.replace('-', ' ') }}</a>
                <mat-icon class="text-[16px]">chevron_right</mat-icon>
                <span class="text-slate-900 dark:text-white font-medium line-clamp-1">{{ product()!.title }}</span>
            </nav>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <!-- Gallery -->
                <div class="flex flex-col gap-4">
                    <div class="card-theme rounded-2xl p-8 flex items-center justify-center h-[500px] shadow-sm">
                        <img [src]="selectedImage()" [alt]="product()!.title" class="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal transform hover:scale-110 transition-transform duration-300" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    </div>
                    <div class="flex gap-4 overflow-x-auto py-2 px-1">
                        @for (img of product()!.images; track img) {
                            <button (click)="selectedImage.set(img)" class="w-20 h-20 flex-shrink-0 card-theme rounded-xl p-2 border-2 transition-all" [class.border-blue-600]="selectedImage() === img" [class.border-transparent]="selectedImage() !== img">
                                <img [src]="img" [alt]="product()!.title" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" crossorigin="anonymous" referrerpolicy="no-referrer" />
                            </button>
                        }
                    </div>
                </div>

                <!-- Info -->
                <div class="flex flex-col text-left">
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">{{ product()!.brand || product()!.category }}</span>
                            <div class="flex items-center space-x-1 text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded">
                                <mat-icon class="text-[16px] w-[16px] h-[16px] leading-none">star</mat-icon>
                                <span class="font-bold">{{ product()!.rating }}</span>
                            </div>
                        </div>
                        <h1 class="text-3xl md:text-4xl font-extrabold mb-4">{{ product()!.title }}</h1>
                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{{ product()!.description }}</p>
                        
                        <div class="flex flex-col space-y-1 mb-8">
                            @if (product()!.discountPercentage > 0) {
                                <div class="flex items-end space-x-4">
                                    <span class="text-4xl font-extrabold text-slate-900 dark:text-white">{{ discountedPrice() | currency:'USD' }}</span>
                                    <div class="flex flex-col">
                                        <span class="text-sm text-slate-400 line-through">{{ product()!.price | currency:'USD' }}</span>
                                        <span class="text-xs font-bold text-emerald-600">Save {{ product()!.discountPercentage }}%</span>
                                    </div>
                                </div>
                            } @else {
                                <span class="text-4xl font-extrabold text-slate-900 dark:text-white">{{ product()!.price | currency:'USD' }}</span>
                            }
                        </div>

                        <!-- Add to cart -->
                        <div class="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <div class="flex items-center card-theme rounded-xl p-1 shadow-sm shrink-0">
                                <button (click)="quantity.set(Math.max(1, quantity() - 1))" class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><mat-icon>remove</mat-icon></button>
                                <span class="w-12 text-center font-bold text-lg">{{ quantity() }}</span>
                                <button (click)="quantity.set(quantity() + 1)" class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><mat-icon>add</mat-icon></button>
                            </div>
                            
                            <button (click)="addToCart()" class="flex-1 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <mat-icon>shopping_cart</mat-icon>
                                Add to Cart
                            </button>
                            
                            <button (click)="toggleWishlist()" class="w-14 h-14 card-theme rounded-xl shadow-sm flex items-center justify-center transition-transform hover:scale-105" [class.text-red-500]="inWishlist()" [class.text-slate-400]="!inWishlist()">
                                <mat-icon>{{ inWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
                            </button>
                        </div>
                        
                        <div class="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 border-t border-gray-200 dark:border-gray-800 pt-8">
                            <div class="flex items-center gap-2"><mat-icon class="text-emerald-500 text-[18px]">check_circle</mat-icon> <span>{{ product()!.availabilityStatus || 'In Stock' }}</span></div>
                            <div class="flex items-center gap-2"><mat-icon class="text-blue-500 text-[18px]">local_shipping</mat-icon> <span>{{ product()!.shippingInformation || 'Ships in 1-2 days' }}</span></div>
                            <div class="flex items-center gap-2"><mat-icon class="text-purple-500 text-[18px]">verified_user</mat-icon> <span>{{ product()!.warrantyInformation || '1 Year Warranty' }}</span></div>
                            <div class="flex items-center gap-2"><mat-icon class="text-slate-500 text-[18px]">inventory_2</mat-icon> <span>SKU: {{ product()!.sku || product()!.id }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Details & Reviews -->
            <div class="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800">
                <h2 class="text-2xl font-bold mb-8">Customer Reviews</h2>
                @if (product()!.reviews && product()!.reviews!.length > 0) {
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @for (review of product()!.reviews; track review.date) {
                            <div class="card-theme p-6 rounded-2xl shadow-sm">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="font-bold">{{ review.reviewerName }}</div>
                                    <div class="flex items-center text-yellow-400 text-xs">
                                        @for (star of [1,2,3,4,5]; track star) {
                                            <mat-icon class="w-4 h-4 text-[16px] leading-none">{{ star <= review.rating ? 'star' : 'star_border' }}</mat-icon>
                                        }
                                    </div>
                                </div>
                                <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">"{{ review.comment }}"</p>
                                <div class="text-xs text-slate-400">{{ review.date | date }}</div>
                            </div>
                        }
                    </div>
                } @else {
                    <p class="text-slate-500">No reviews yet for this product.</p>
                }
            </div>
        }
     </main>
  `
})
export class ProductDetailsComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  
  Math = Math;
  
  product = signal<Product | null>(null);
  selectedImage = signal<string>('');
  loading = signal(true);
  quantity = signal(1);

  discountedPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return p.price * (1 - (p.discountPercentage || 0) / 100);
  });

  inWishlist = computed(() => {
    const p = this.product();
    return p ? this.wishlistService.isInWishlist(p.id) : false;
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.apiService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.selectedImage.set(data.images && data.images.length > 0 ? data.images[0] : data.thumbnail);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleWishlist() {
    const p = this.product();
    if (p) this.wishlistService.toggleWishlist(p);
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.quantity.set(1);
    }
  }
}
