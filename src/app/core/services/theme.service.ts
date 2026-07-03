import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('online-tech-theme');
    if (saved) {
      this.isDarkMode.set(saved === 'dark');
    } else {
      this.isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('online-tech-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('online-tech-theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}
