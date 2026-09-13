import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../core/services/chess-engine.service';
import { PieceComponent } from '../chess-board/piece/piece.component';

@Component({
  selector: 'app-game-status',
  standalone: true,
  imports: [CommonModule, PieceComponent],
  template: `
    <div class="flex flex-col gap-3 w-full">
      <!-- Player 2 (Black) Info Header -->
      <div
        [class]="chessEngine.turn() === 'b' ? 'bg-white dark:bg-[#0b0f17] border-amber-500/80 shadow-md ring-2 ring-amber-500/20' : 'bg-white/80 dark:bg-black/60 border-slate-200 dark:border-white/5'"
        class="flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
            <div class="w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-500"></div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-slate-800 dark:text-zinc-100">Black</span>
              <span *ngIf="chessEngine.turn() === 'b' && !chessEngine.isGameOver()" class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </div>
            <!-- Captured White pieces by Black -->
            <div class="flex items-center gap-0.5 mt-0.5 min-h-[20px]">
              <div
                *ngFor="let piece of chessEngine.capturedPieces().b"
                class="w-4 h-4 flex items-center justify-center -mr-1"
              >
                <app-piece [type]="piece" color="w"></app-piece>
              </div>
              <span
                *ngIf="chessEngine.capturedPieces().materialAdvantage.color === 'b'"
                class="text-[11px] font-bold text-amber-600 dark:text-amber-400 ml-2"
              >
                +{{ chessEngine.capturedPieces().materialAdvantage.score }}
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="chessEngine.turn() === 'b' && !chessEngine.isGameOver()" class="text-xs font-bold text-amber-700 dark:text-amber-400 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-lg">
          To Move
        </div>
      </div>

      <!-- Game Status Banner (Check, Checkmate, Draw) -->
      <div
        *ngIf="chessEngine.isGameOver() || chessEngine.isCheck()"
        [class]="getStatusBannerClass()"
        class="p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 text-center font-bold text-sm animate-pulse shadow-md"
      >
        <svg *ngIf="chessEngine.isCheckmate()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>

        <svg *ngIf="chessEngine.isCheck() && !chessEngine.isGameOver()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>

        <span>{{ chessEngine.statusMessage() }}</span>
      </div>

      <!-- Player 1 (White) Info Header -->
      <div
        [class]="chessEngine.turn() === 'w' ? 'bg-white dark:bg-[#0b0f17] border-amber-500/80 shadow-md ring-2 ring-amber-500/20' : 'bg-white/80 dark:bg-black/60 border-slate-200 dark:border-white/5'"
        class="flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shadow-inner">
            <div class="w-4 h-4 rounded-full bg-white border-2 border-slate-400"></div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-slate-800 dark:text-zinc-100">White</span>
              <span *ngIf="chessEngine.turn() === 'w' && !chessEngine.isGameOver()" class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </div>
            <!-- Captured Black pieces by White -->
            <div class="flex items-center gap-0.5 mt-0.5 min-h-[20px]">
              <div
                *ngFor="let piece of chessEngine.capturedPieces().w"
                class="w-4 h-4 flex items-center justify-center -mr-1"
              >
                <app-piece [type]="piece" color="b"></app-piece>
              </div>
              <span
                *ngIf="chessEngine.capturedPieces().materialAdvantage.color === 'w'"
                class="text-[11px] font-bold text-amber-600 dark:text-amber-400 ml-2"
              >
                +{{ chessEngine.capturedPieces().materialAdvantage.score }}
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="chessEngine.turn() === 'w' && !chessEngine.isGameOver()" class="text-xs font-bold text-amber-700 dark:text-amber-400 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-lg">
          To Move
        </div>
      </div>
    </div>
  `,
})
export class GameStatusComponent {
  public chessEngine = inject(ChessEngineService);

  public getStatusBannerClass(): string {
    if (this.chessEngine.isCheckmate()) {
      return 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300';
    }
    if (this.chessEngine.isDraw() || this.chessEngine.isStalemate()) {
      return 'bg-slate-100 dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200';
    }
    if (this.chessEngine.isCheck()) {
      return 'bg-red-50 dark:bg-red-950/80 border-red-400 dark:border-red-500 text-red-800 dark:text-red-300';
    }
    return 'bg-white dark:bg-black/60 border-slate-200 dark:border-white/5 text-slate-700 dark:text-zinc-300';
  }
}
