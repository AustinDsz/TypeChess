import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceSymbol, Color } from 'chess.js';
import { ChessEngineService } from '../../core/services/chess-engine.service';
import { Square } from '../../core/models/chess.models';
import { SquareComponent } from './square/square.component';
import { PieceComponent } from './piece/piece.component';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

interface SquareData {
  square: Square;
  rank: number;
  file: string;
  isLight: boolean;
  rowIdx: number;
  colIdx: number;
}

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, PieceComponent],
  template: `
    <div class="relative flex flex-col items-center justify-center select-none w-full max-w-[560px] aspect-square mx-auto">
      <!-- Outer Board Frame -->
      <div class="w-full h-full p-2.5 sm:p-3.5 bg-slate-900/80 dark:bg-black/90 dark:border dark:border-white/10 dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] light:bg-amber-950 light:border-amber-900 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center">
        <!-- Inner 8x8 Grid -->
        <div class="grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl overflow-hidden border-2 border-slate-950/80 dark:border-white/5 shadow-inner">
          <app-square
            *ngFor="let sq of renderedSquares()"
            [square]="sq.square"
            [rank]="sq.rank"
            [file]="sq.file"
            [isLight]="sq.isLight"
            [piece]="getPieceAt(sq.square)"
            [isSelected]="chessEngine.selectedSquare() === sq.square"
            [isLegalMove]="chessEngine.legalMoves().includes(sq.square)"
            [isLastMove]="isSquareLastMove(sq.square)"
            [isCheckKing]="isKingInCheckSquare(sq.square)"
            [showRank]="isFirstColumn(sq)"
            [showFile]="isLastRow(sq)"
            (squareClicked)="onSquareClicked($event)"
          ></app-square>
        </div>
      </div>

      <!-- Pawn Promotion Overlay Modal -->
      <div
        *ngIf="chessEngine.pendingPromotion(); let promotion"
        class="absolute inset-0 bg-black/70 backdrop-blur-md rounded-2xl flex items-center justify-center z-50 animate-fade-in p-4"
      >
        <div class="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center flex flex-col items-center transition-colors">
          <h3 class="text-xl font-bold text-amber-500 dark:text-amber-400 mb-1">Promote Pawn</h3>
          <p class="text-xs text-slate-500 dark:text-zinc-400 mb-5">Select a piece to upgrade your pawn</p>

          <div class="grid grid-cols-4 gap-3 w-full mb-5">
            <button
              *ngFor="let option of promotionOptions"
              (click)="selectPromotion(option)"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-amber-500/20 dark:hover:bg-amber-500/20 border border-slate-200 dark:border-zinc-800 hover:border-amber-500 transition-all cursor-pointer transform hover:scale-105 group shadow-sm"
            >
              <div class="w-12 h-12 flex items-center justify-center mb-1">
                <app-piece [type]="option" [color]="promotion.color"></app-piece>
              </div>
              <span class="text-[11px] font-bold text-slate-700 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 uppercase tracking-wider">
                {{ getPieceName(option) }}
              </span>
            </button>
          </div>

          <button
            (click)="cancelPromotion()"
            class="text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors font-medium cursor-pointer"
          >
            Cancel Move
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ChessBoardComponent {
  public chessEngine = inject(ChessEngineService);
  public promotionOptions: PieceSymbol[] = ['q', 'r', 'b', 'n'];

  public renderedSquares = computed<SquareData[]>(() => {
    const isFlipped = this.chessEngine.isFlipped();
    const rankList = isFlipped ? [...RANKS].reverse() : RANKS;
    const fileList = isFlipped ? [...FILES].reverse() : FILES;

    const squares: SquareData[] = [];

    for (let rIdx = 0; rIdx < 8; rIdx++) {
      const rank = rankList[rIdx];
      for (let fIdx = 0; fIdx < 8; fIdx++) {
        const file = fileList[fIdx];
        const square = `${file}${rank}` as Square;
        const origFileIdx = FILES.indexOf(file);
        const origRankIdx = 8 - rank;
        const isLight = (origFileIdx + origRankIdx) % 2 === 0;

        squares.push({
          square,
          rank,
          file,
          isLight,
          rowIdx: rIdx,
          colIdx: fIdx,
        });
      }
    }

    return squares;
  });

  public onSquareClicked(square: Square): void {
    this.chessEngine.handleSquareClick(square);
  }

  public getPieceAt(square: Square): { type: PieceSymbol; color: Color } | null {
    const board = this.chessEngine.board();
    const file = square[0];
    const rank = parseInt(square[1], 10);
    const colIdx = FILES.indexOf(file);
    const rowIdx = 8 - rank;

    const cell = board[rowIdx]?.[colIdx];
    return cell ? { type: cell.type, color: cell.color } : null;
  }

  public isSquareLastMove(square: Square): boolean {
    const last = this.chessEngine.lastMove();
    return last ? last.from === square || last.to === square : false;
  }

  public isKingInCheckSquare(square: Square): boolean {
    if (!this.chessEngine.isCheck()) return false;
    const piece = this.getPieceAt(square);
    return piece !== null && piece.type === 'k' && piece.color === this.chessEngine.turn();
  }

  public isFirstColumn(sq: SquareData): boolean {
    return sq.colIdx === 0;
  }

  public isLastRow(sq: SquareData): boolean {
    return sq.rowIdx === 7;
  }

  public selectPromotion(piece: PieceSymbol): void {
    this.chessEngine.completePromotion(piece);
  }

  public cancelPromotion(): void {
    this.chessEngine.cancelPromotion();
  }

  public getPieceName(symbol: PieceSymbol): string {
    switch (symbol) {
      case 'q': return 'Queen';
      case 'r': return 'Rook';
      case 'b': return 'Bishop';
      case 'n': return 'Knight';
      default: return '';
    }
  }
}
