import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[70vh] flex flex-col items-center justify-center p-10 text-center">
      <div class="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
        <mat-icon class="text-[48px] w-[48px] h-[48px]">gpp_bad</mat-icon>
      </div>
      <h1 class="text-3xl font-extrabold mb-4">Access Denied</h1>
      <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        You do not have the required permissions to access this page. Please contact the administrator if you believe this is a mistake.
      </p>
      <div class="flex gap-4">
        <a routerLink="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
          Return Home
        </a>
      </div>
    </main>
  `
})
export class UnauthorizedComponent {}
