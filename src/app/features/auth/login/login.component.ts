import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[80vh] flex items-center justify-center p-6">
      <div class="card-theme w-full max-w-md rounded-3xl p-8 shadow-sm">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold mb-2">Welcome Back</h1>
          <p class="text-slate-500">Sign in to your account</p>
        </div>

        @if (errorMessage()) {
            <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                <mat-icon class="text-[20px]">error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
            </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="space-y-1 text-left">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div class="relative">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">email</mat-icon>
                <input formControlName="email" type="email" placeholder="you@example.com" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" />
            </div>
          </div>

          <div class="space-y-1 text-left">
            <div class="flex items-center justify-between ml-1">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a routerLink="/forgot-password" class="text-xs text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <div class="relative">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</mat-icon>
                <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" />
                <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center">
                    <mat-icon class="text-[20px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm ml-1">
            <input type="checkbox" formControlName="rememberMe" id="remember" class="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
            <label for="remember" class="text-slate-600 dark:text-slate-400 cursor-pointer">Remember me</label>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || authService.isLoading()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
            @if (authService.isLoading()) {
                <mat-icon class="animate-spin text-[20px]">refresh</mat-icon>
                <span>Signing in...</span>
            } @else {
                <span>Sign In</span>
                <mat-icon class="text-[20px]">arrow_forward</mat-icon>
            }
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Don't have an account? <a routerLink="/register" class="text-blue-600 font-bold hover:underline">Create account</a>
        </p>

        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-slate-400 text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
           <p class="font-bold mb-1 text-slate-600 dark:text-slate-300">Demo Accounts:</p>
           <p>Admin: admin&#64;onlinetech.com / Admin&#64;123456</p>
           <p>Customer: customer&#64;onlinetech.com / Customer&#64;123</p>
        </div>
      </div>
    </main>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage.set('');
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email!, password!).subscribe({
        next: (res) => {
          if (res.user.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Login failed. Please try again.');
        }
      });
    } else {
        this.loginForm.markAllAsTouched();
    }
  }
}
