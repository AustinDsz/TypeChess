import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../core/services/chess-engine.service';

@Component({
  selector: 'app-game-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3 w-full">
      <div class="grid grid-cols-3 gap-2.5">
        <!-- Flip Board -->
        <button
          (click)="chessEngine.toggleFlip()"
          class="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-white dark:bg-[#0b0f17] hover:bg-slate-50 dark:hover:bg-[#141b29] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm group active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mb-1 text-slate-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="m21 8-4-4-4 4" />
            <path d="M17 4v16" />
          </svg>
          <span>Flip Board</span>
        </button>

        <!-- Undo Move -->
        <button
          (click)="chessEngine.undoMove()"
          [disabled]="chessEngine.moveHistory().length === 0"
          class="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-white dark:bg-[#0b0f17] hover:bg-slate-50 dark:hover:bg-[#141b29] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-[#0b0f17] disabled:cursor-not-allowed transition-all text-xs font-semibold cursor-pointer shadow-sm group active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mb-1 text-slate-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
          <span>Undo Move</span>
        </button>

        <!-- Restart / New Game -->
        <button
          (click)="confirmNewGame()"
          class="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-white dark:bg-[#0b0f17] hover:bg-slate-50 dark:hover:bg-[#141b29] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm group active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mb-1 text-slate-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>New Game</span>
        </button>
      </div>

      <!-- Confirmation Modal / Bar for Reset -->
      <div
        *ngIf="showConfirmModal()"
        class="flex items-center justify-between p-3.5 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-600/50 rounded-2xl text-amber-900 dark:text-amber-200 text-xs font-medium animate-fade-in shadow-md"
      >
        <span>Start a fresh new game?</span>
        <div class="flex items-center gap-2">
          <button
            (click)="doRestart()"
            class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Confirm
          </button>
          <button
            (click)="showConfirmModal.set(false)"
            class="px-2.5 py-1 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
})
export class GameActionsComponent {
  public chessEngine = inject(ChessEngineService);
  public showConfirmModal = signal<boolean>(false);

  public confirmNewGame() {
    if (this.chessEngine.moveHistory().length === 0) {
      this.chessEngine.resetGame();
      return;
    }
    this.showConfirmModal.set(true);
  }

  public doRestart() {
    this.chessEngine.resetGame();
    this.showConfirmModal.set(false);
  }
}
