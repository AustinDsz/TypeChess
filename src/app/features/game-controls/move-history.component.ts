import { Component, inject, computed, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../core/services/chess-engine.service';
import { MoveInfo } from '../../core/models/chess.models';

interface MovePair {
  turnNumber: number;
  white?: MoveInfo;
  black?: MoveInfo;
}

@Component({
  selector: 'app-move-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-[#0b0f17] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col h-[280px] shadow-sm transition-colors">
      <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-white/5">
        <h3 class="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
          Move History
        </h3>
        <span class="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
          {{ chessEngine.moveHistory().length }} half-moves
        </span>
      </div>

      <!-- Scrollable History List -->
      <div #historyContainer class="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-800">
        <div *ngIf="movePairs().length === 0" class="h-full flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500 italic">
          No moves yet. Make a move to begin!
        </div>

        <div
          *ngFor="let pair of movePairs()"
          class="grid grid-cols-12 gap-2 text-xs py-1.5 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-mono"
        >
          <!-- Turn Number -->
          <span class="col-span-2 text-slate-400 dark:text-zinc-500 font-semibold">{{ pair.turnNumber }}.</span>

          <!-- White's Move -->
          <span
            [class]="pair.white ? 'text-slate-900 dark:text-zinc-100 font-medium' : 'text-slate-400 dark:text-zinc-600'"
            class="col-span-5 flex items-center gap-1"
          >
            {{ pair.white?.san || '-' }}
          </span>

          <!-- Black's Move -->
          <span
            [class]="pair.black ? 'text-slate-900 dark:text-zinc-100 font-medium' : 'text-slate-400 dark:text-zinc-600'"
            class="col-span-5 flex items-center gap-1"
          >
            {{ pair.black?.san || '-' }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class MoveHistoryComponent {
  public chessEngine = inject(ChessEngineService);
  private historyContainer = viewChild<ElementRef<HTMLDivElement>>('historyContainer');

  public movePairs = computed<MovePair[]>(() => {
    const history = this.chessEngine.moveHistory();
    const pairs: MovePair[] = [];

    for (let i = 0; i < history.length; i += 2) {
      const turnNumber = Math.floor(i / 2) + 1;
      const white = history[i];
      const black = history[i + 1];
      pairs.push({ turnNumber, white, black });
    }

    return pairs;
  });

  constructor() {
    effect(() => {
      // Trigger whenever moveHistory changes
      this.chessEngine.moveHistory();
      setTimeout(() => {
        const el = this.historyContainer()?.nativeElement;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, 50);
    });
  }
}
