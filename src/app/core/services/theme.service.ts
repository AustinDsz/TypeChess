import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'typechess-theme';
  public theme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
    });
  }

  public toggleTheme(): void {
    const nextTheme: AppTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public setTheme(theme: AppTheme): void {
    this.theme.set(theme);
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch {
      // Ignore storage errors in restricted iframe/private mode
    }
  }

  private getInitialTheme(): AppTheme {
    try {
      const stored = localStorage.getItem(this.THEME_KEY) as AppTheme | null;
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {
      // Fallback
    }

    // Default to AMOLED dark as requested
    return 'dark';
  }

  private applyTheme(theme: AppTheme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }
}
