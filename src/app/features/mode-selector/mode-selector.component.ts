import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../core/services/chess-engine.service';
import { GameMode } from '../../core/models/chess.models';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center gap-2 p-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm max-w-md mx-auto mb-6 transition-colors">
      <!-- 2-Player Pass and Play (Active) -->
      <button
        (click)="selectMode('pass-and-play')"
        [class]="chessEngine.gameMode() === 'pass-and-play' ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold shadow-md shadow-amber-900/20' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-white/5 font-medium'"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>2 Players (Local)</span>
      </button>

      <!-- Compete with AI (Disabled for now) -->
      <div class="flex-1 relative group">
        <button
          disabled
          class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm text-slate-400 dark:text-zinc-600 bg-slate-100/70 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/60 cursor-not-allowed opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
            <path d="M9 15h6" />
          </svg>
          <span>Play vs AI</span>
          <span class="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Soon
          </span>
        </button>

        <!-- Hover Tooltip -->
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
          <div class="bg-slate-900 dark:bg-zinc-950 border border-slate-700 dark:border-zinc-800 text-xs text-slate-100 dark:text-zinc-200 px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            AI engine is currently in development
          </div>
          <div class="w-2 h-2 bg-slate-900 dark:bg-zinc-950 border-r border-b border-slate-700 dark:border-zinc-800 transform rotate-45 -mt-1"></div>
        </div>
      </div>
    </div>
  `,
})
export class ModeSelectorComponent {
  public chessEngine = inject(ChessEngineService);

  public selectMode(mode: GameMode) {
    this.chessEngine.setGameMode(mode);
  }
}
