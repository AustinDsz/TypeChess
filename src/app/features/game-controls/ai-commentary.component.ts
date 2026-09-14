import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../core/services/chess-engine.service';

@Component({
  selector: 'app-ai-commentary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="chessEngine.gameMode() === 'play-vs-ai' && (chessEngine.aiService.isAiThinking() || chessEngine.aiService.aiCommentary())"
      class="w-full bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900/40 dark:bg-black/60 border border-blue-500/30 rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-fade-in transition-all"
    >
      <!-- Carl Avatar -->
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-900/30 text-white font-extrabold text-xs">
        <span *ngIf="!chessEngine.aiService.isAiThinking()">C</span>

        <!-- Spinner when thinking -->
        <svg *ngIf="chessEngine.aiService.isAiThinking()" class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Dialogue Bubble -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-0.5">
          <span class="text-xs font-bold text-blue-400 flex items-center gap-1.5">
            Carl
            <span *ngIf="chessEngine.aiService.isAiThinking()" class="text-[10px] text-blue-300/80 font-normal italic">
              thinking...
            </span>
          </span>
          <span class="text-[9px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded font-bold">
            {{ chessEngine.aiService.difficulty() }}
          </span>
        </div>

        <p *ngIf="chessEngine.aiService.aiCommentary()" class="text-xs text-slate-100 dark:text-zinc-200 font-medium italic truncate">
          "{{ chessEngine.aiService.aiCommentary() }}"
        </p>

        <!-- Live Engine Provenance Badge -->
        <div class="mt-1 flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-zinc-500">
          <span class="w-1.5 h-1.5 rounded-full" [class]="chessEngine.aiService.activeEngine().includes('Gemini') || chessEngine.aiService.activeEngine().includes('gemini') ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
          <span>Engine: {{ chessEngine.aiService.activeEngine() }}</span>
        </div>
      </div>
    </div>
  `,
})
export class AiCommentaryComponent {
  public chessEngine = inject(ChessEngineService);
}
