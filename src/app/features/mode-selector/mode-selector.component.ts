import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../core/services/chess-engine.service';
import { GameMode } from '../../core/models/chess.models';
import { AiDifficulty } from '../../core/models/ai.models';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2.5 max-w-md mx-auto mb-6 w-full">
      <!-- Mode Tabs Container -->
      <div class="flex items-center justify-center gap-2 p-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm w-full transition-colors">
        <!-- 2-Player Pass and Play -->
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

        <!-- Play vs Gemini AI (Enabled) -->
        <button
          (click)="selectMode('play-vs-ai')"
          [class]="chessEngine.gameMode() === 'play-vs-ai' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-indigo-900/30' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-white/5 font-medium'"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <span>Play vs Gemini</span>
          <span class="text-[9px] bg-blue-400/20 text-blue-700 dark:text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider">
            AI
          </span>
        </button>
      </div>

      <!-- AI Difficulty & Color Settings (Visible when Play vs AI is active) -->
      <div
        *ngIf="chessEngine.gameMode() === 'play-vs-ai'"
        class="flex items-center justify-between gap-2 p-2 bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl border border-slate-200 dark:border-white/5 text-xs animate-fade-in"
      >
        <span class="text-slate-500 dark:text-zinc-400 font-semibold pl-2 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m4.93 4.93 4.24 4.24"/>
            <path d="m14.83 9.17 4.24-4.24"/>
            <path d="m14.83 14.83 4.24 4.24"/>
            <path d="m9.17 14.83-4.24 4.24"/>
          </svg>
          Difficulty:
        </span>

        <div class="flex items-center gap-1">
          <button
            *ngFor="let diff of difficulties"
            (click)="setDifficulty(diff.id)"
            [class]="chessEngine.aiService.difficulty() === diff.id ? getActiveDiffClass(diff.id) : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'"
            class="px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px]"
          >
            {{ diff.label }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ModeSelectorComponent {
  public chessEngine = inject(ChessEngineService);

  public difficulties: { id: AiDifficulty; label: string }[] = [
    { id: 'easy', label: 'Casual' },
    { id: 'medium', label: 'Club' },
    { id: 'hard', label: 'Master' },
  ];

  public selectMode(mode: GameMode) {
    this.chessEngine.setGameMode(mode);
  }

  public setDifficulty(diff: AiDifficulty) {
    this.chessEngine.aiService.setDifficulty(diff);
  }

  public getActiveDiffClass(diff: AiDifficulty): string {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-500 text-white shadow-sm';
      case 'medium':
        return 'bg-amber-500 text-white shadow-sm';
      case 'hard':
        return 'bg-rose-500 text-white shadow-sm';
    }
  }
}
