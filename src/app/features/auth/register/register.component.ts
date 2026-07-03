import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[80vh] flex items-center justify-center p-6 my-8">
      <div class="card-theme w-full max-w-xl rounded-3xl p-8 shadow-sm">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold mb-2">Create Account</h1>
          <p class="text-slate-500">Join us to shop the best tech products</p>
        </div>

        @if (errorMessage()) {
            <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                <mat-icon class="text-[20px]">error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
            </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1 text-left">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                <input formControlName="firstName" type="text" placeholder="John" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                <input formControlName="lastName" type="text" placeholder="Doe" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" />
              </div>
          </div>

          <div class="space-y-1 text-left">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div class="relative">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">email</mat-icon>
                <input formControlName="email" type="email" placeholder="you@example.com" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" />
            </div>
            @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <p class="text-xs text-red-500 ml-1 mt-1">Please enter a valid email address.</p>
            }
          </div>

          <div class="space-y-1 text-left">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Phone Number (Optional)</label>
            <div class="relative">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">phone</mat-icon>
                <input formControlName="phone" type="tel" placeholder="+1 (555) 000-0000" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <div class="space-y-1 text-left">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div class="relative">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</mat-icon>
                <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" />
                <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center">
                    <mat-icon class="text-[20px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
            </div>
            @if (registerForm.get('password')?.hasError('pattern') && registerForm.get('password')?.touched) {
                <p class="text-xs text-red-500 ml-1 mt-1 leading-tight">Password must be at least 8 characters, include uppercase, lowercase, number, and special character.</p>
            }
          </div>

          <div class="space-y-1 text-left">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
            <div class="relative">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</mat-icon>
                <input [type]="showConfirmPassword() ? 'text' : 'password'" formControlName="confirmPassword" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" [class.border-red-300]="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" />
                <button type="button" (click)="showConfirmPassword.set(!showConfirmPassword())" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center">
                    <mat-icon class="text-[20px]">{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
            </div>
            @if (registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched) {
                <p class="text-xs text-red-500 ml-1 mt-1">Passwords do not match.</p>
            }
          </div>

          <div class="flex items-start gap-3 text-sm ml-1 mt-4">
            <input type="checkbox" formControlName="acceptTerms" id="terms" class="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer" />
            <label for="terms" class="text-slate-600 dark:text-slate-400 cursor-pointer leading-snug" [class.text-red-500]="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched">
                I agree to the <a href="#" class="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || authService.isLoading()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
            @if (authService.isLoading()) {
                <mat-icon class="animate-spin text-[20px]">refresh</mat-icon>
                <span>Creating account...</span>
            } @else {
                <span>Create Account</span>
                <mat-icon class="text-[20px]">person_add</mat-icon>
            }
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Already have an account? <a routerLink="/login" class="text-blue-600 font-bold hover:underline">Sign in</a>
        </p>
      </div>
    </main>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  errorMessage = signal('');

  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
    newsletter: [false]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.errorMessage.set('');
      const data = this.registerForm.value;
      
      this.authService.register(data).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Registration failed. Please try again.');
        }
      });
    } else {
        this.registerForm.markAllAsTouched();
    }
  }
}
