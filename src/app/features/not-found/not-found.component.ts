import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[70vh] flex flex-col items-center justify-center p-10 text-center">
      <div class="text-[120px] font-extrabold text-slate-200 dark:text-slate-800 leading-none mb-4">404</div>
      <h1 class="text-3xl font-extrabold mb-4">Page Not Found</h1>
      <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div class="flex gap-4">
        <a routerLink="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
          Return Home
        </a>
      </div>
    </main>
  `
})
export class NotFoundComponent {}
