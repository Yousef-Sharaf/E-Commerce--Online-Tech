import { Injectable, signal, computed, effect } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSignal = signal<CartItem[]>(this.loadCart());

  cartItems = this.cartItemsSignal.asReadonly();
  
  cartTotal = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => {
      const price = item.price * (1 - (item.discountPercentage || 0) / 100);
      return total + (price * item.quantity);
    }, 0);
  });

  cartCount = computed(() => {
    return this.cartItemsSignal().reduce((count, item) => count + item.quantity, 0);
  });

  constructor() {
    effect(() => {
      localStorage.setItem('online-tech-cart', JSON.stringify(this.cartItemsSignal()));
    });
  }

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('online-tech-cart');
    return saved ? JSON.parse(saved) : [];
  }

  addToCart(product: Product, quantity: number = 1) {
    this.cartItemsSignal.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...items, { ...product, quantity }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItemsSignal.update(items => items.filter(i => i.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItemsSignal.update(items => items.map(i => i.id === productId ? { ...i, quantity } : i));
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }
}
