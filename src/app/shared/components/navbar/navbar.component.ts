import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../../core/services/audio.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-colors">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <svg class="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 22H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2ZM8 16h8l1-5H7l1 5Zm-3-8l3 2 4-5 4 5 3-2 1 3H4l1-3Z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              TypeChess
              <span class="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">v1.0</span>
            </h1>
          </div>
        </div>

        <!-- Right Action Items -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Light / Dark Theme Switcher Button -->
          <button
            (click)="themeService.toggleTheme()"
            [title]="themeService.theme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0b0f17] dark:hover:bg-[#141b29] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <!-- Sun icon when in dark mode -->
            <svg *ngIf="themeService.theme() === 'dark'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>

            <!-- Moon icon when in light mode -->
            <svg *ngIf="themeService.theme() === 'light'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          </button>

          <!-- Audio Toggle Button -->
          <button
            (click)="audioService.toggleMute()"
            [title]="audioService.isMuted() ? 'Unmute Sound FX' : 'Mute Sound FX'"
            class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0b0f17] dark:hover:bg-[#141b29] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <!-- Unmuted Icon -->
            <svg *ngIf="!audioService.isMuted()" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>

            <!-- Muted Icon -->
            <svg *ngIf="audioService.isMuted()" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" x2="16" y1="9" y2="15" />
              <line x1="16" x2="22" y1="9" y2="15" />
            </svg>
          </button>

          <!-- Auth Button -->
          <div *ngIf="!authService.isLoggedIn()" class="relative">
            <button
              (click)="openLoginModal()"
              class="flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-900/20 cursor-pointer active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Login</span>
            </button>
          </div>

          <div *ngIf="authService.isLoggedIn()" class="flex items-center gap-2">
            <span class="text-xs text-slate-800 dark:text-zinc-200 font-medium">{{ authService.currentUser().username }}</span>
            <button
              (click)="authService.logout()"
              class="text-xs text-slate-500 dark:text-zinc-400 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Login Dialog / Preview Modal -->
    <div
      *ngIf="showLoginModal()"
      class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div class="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Player Sign In</h3>
          <button (click)="showLoginModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer">✕</button>
        </div>

        <p class="text-xs text-slate-500 dark:text-zinc-400 mb-4">
          Enter a display name to test user identity. Full authentication with cloud storage will be connected soon!
        </p>

        <form (ngSubmit)="handleLogin()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              [(ngModel)]="usernameInput"
              placeholder="e.g. GrandMaster99"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
              required
            />
          </div>

          <div class="flex gap-2 justify-end pt-2">
            <button
              type="button"
              (click)="showLoginModal.set(false)"
              class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white dark:text-slate-950 rounded-xl shadow-md cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class NavbarComponent {
  public audioService = inject(AudioService);
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);

  public showLoginModal = signal<boolean>(false);
  public usernameInput = '';

  public openLoginModal() {
    this.usernameInput = '';
    this.showLoginModal.set(true);
  }

  public handleLogin() {
    if (this.usernameInput.trim()) {
      this.authService.loginWithCredentials(this.usernameInput.trim());
      this.showLoginModal.set(false);
    }
  }
}
