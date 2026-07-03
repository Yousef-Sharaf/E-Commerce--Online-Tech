import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSignal = signal<Product[]>(this.loadWishlist());

  wishlistItems = this.wishlistItemsSignal.asReadonly();
  
  wishlistCount = computed(() => this.wishlistItemsSignal().length);

  constructor() {
    effect(() => {
      localStorage.setItem('online-tech-wishlist', JSON.stringify(this.wishlistItemsSignal()));
    });
  }

  private loadWishlist(): Product[] {
    const saved = localStorage.getItem('online-tech-wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  toggleWishlist(product: Product) {
    this.wishlistItemsSignal.update(items => {
      const exists = items.some(i => i.id === product.id);
      if (exists) {
        return items.filter(i => i.id !== product.id);
      }
      return [...items, product];
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItemsSignal().some(i => i.id === productId);
  }

  removeFromWishlist(productId: number) {
    this.wishlistItemsSignal.update(items => items.filter(i => i.id !== productId));
  }

  clearWishlist() {
    this.wishlistItemsSignal.set([]);
  }
}
