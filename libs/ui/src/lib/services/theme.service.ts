import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'sp-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<'light' | 'dark'>(this.resolveInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    if (theme === 'system') {
      localStorage.removeItem(STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved: 'light' | 'dark' = prefersDark ? 'dark' : 'light';
      this.theme.set(resolved);
      this.applyTheme(resolved);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
      this.theme.set(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  private resolveInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
