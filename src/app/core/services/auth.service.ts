import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, AuthResponse, Role } from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  
  private readonly AUTH_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Signals for state management
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  private initAuth() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.AUTH_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        } catch (e) {
          this.logout();
        }
      }
    }
  }

  // Mock Login
  login(email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);
    
    // Simulate API delay
    return new Observable<AuthResponse>(observer => {
      setTimeout(() => {
        let user: User | null = null;

        // Mock accounts
        if (email === 'admin@onlinetech.com' && password === 'Admin@123456') {
          user = {
            id: 'admin-1',
            firstName: 'System',
            lastName: 'Admin',
            email: 'admin@onlinetech.com',
            role: 'Admin'
          };
        } else if (email === 'customer@onlinetech.com' && password === 'Customer@123') {
          user = {
            id: 'cust-1',
            firstName: 'Demo',
            lastName: 'Customer',
            email: 'customer@onlinetech.com',
            role: 'Customer'
          };
        } else {
          // Additional mock accounts could be created via localStorage in a real system.
          // For now, accept registration from local storage.
          if (isPlatformBrowser(this.platformId)) {
            const usersStr = localStorage.getItem('mock_users');
            if (usersStr) {
              const users: User[] = JSON.parse(usersStr);
              // Since we don't store passwords securely in this mock, we just check if user exists.
              // In real world, we would check password hash.
              const foundUser = users.find(u => u.email === email);
              if (foundUser) {
                  user = foundUser;
              }
            }
          }
        }

        if (user) {
          const token = 'mock-jwt-token-' + user.id + '-' + Date.now();
          const response: AuthResponse = { user, token };
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.AUTH_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          }
          
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          this.isLoading.set(false);
          
          observer.next(response);
          observer.complete();
        } else {
          this.isLoading.set(false);
          observer.error({ message: 'Invalid email or password' });
        }
      }, 1000);
    });
  }

  // Mock Register
  register(data: any): Observable<AuthResponse> {
    this.isLoading.set(true);
    
    return new Observable<AuthResponse>(observer => {
      setTimeout(() => {
        const newUser: User = {
          id: 'user-' + Date.now(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: 'Customer'
        };

        if (isPlatformBrowser(this.platformId)) {
           const usersStr = localStorage.getItem('mock_users');
           let users: User[] = usersStr ? JSON.parse(usersStr) : [];
           
           if (users.find(u => u.email === data.email) || data.email === 'admin@onlinetech.com' || data.email === 'customer@onlinetech.com') {
               this.isLoading.set(false);
               observer.error({ message: 'Email already exists' });
               return;
           }
           
           users.push(newUser);
           localStorage.setItem('mock_users', JSON.stringify(users));
        }

        const token = 'mock-jwt-token-' + newUser.id + '-' + Date.now();
        const response: AuthResponse = { user: newUser, token };
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.AUTH_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
        }
        
        this.currentUser.set(newUser);
        this.isAuthenticated.set(true);
        this.isLoading.set(false);
        
        observer.next(response);
        observer.complete();
      }, 1500);
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.AUTH_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.AUTH_KEY);
    }
    return null;
  }

  hasRole(role: Role): boolean {
    const user = this.currentUser();
    return user ? user.role === role : false;
  }
}
