import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[80vh] flex items-center justify-center p-6">
      <div class="card-theme w-full max-w-md rounded-3xl p-8 shadow-sm">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-[32px]">lock_reset</mat-icon>
          </div>
          <h1 class="text-3xl font-extrabold mb-2">Forgot Password</h1>
          <p class="text-slate-500 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        @if (isSuccess()) {
            <div class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl text-sm mb-6 flex flex-col items-center gap-2 text-center">
                <mat-icon class="text-[32px] mb-2">mark_email_read</mat-icon>
                <p class="font-bold">Check your email</p>
                <p>We've sent password reset instructions to your email address.</p>
                <a routerLink="/login" class="mt-4 text-blue-600 font-bold hover:underline">Return to sign in</a>
            </div>
        } @else {
            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-5">
              <div class="space-y-1 text-left">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                <div class="relative">
                    <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">email</mat-icon>
                    <input formControlName="email" type="email" placeholder="you@example.com" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched" />
                </div>
              </div>

              <button type="submit" [disabled]="forgotForm.invalid || isLoading()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                @if (isLoading()) {
                    <mat-icon class="animate-spin text-[20px]">refresh</mat-icon>
                    <span>Sending...</span>
                } @else {
                    <span>Send Reset Link</span>
                    <mat-icon class="text-[20px]">send</mat-icon>
                }
              </button>
            </form>

            <p class="text-center text-sm text-slate-500 mt-8">
              Remember your password? <a routerLink="/login" class="text-blue-600 font-bold hover:underline">Sign in</a>
            </p>
        }
      </div>
    </main>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  isSuccess = signal(false);

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      }, 1500);
    } else {
        this.forgotForm.markAllAsTouched();
    }
  }
}
