import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, PieceSymbol } from 'chess.js';
import { Square } from '../../../core/models/chess.models';
import { PieceComponent } from '../piece/piece.component';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [CommonModule, PieceComponent],
  template: `
    <div
      (click)="onClick()"
      [class]="getSquareClasses()"
      class="relative w-full h-full flex items-center justify-center select-none cursor-pointer transition-colors duration-100"
    >
      <!-- Coordinate Labels: File on bottom rank, Rank on leftmost file -->
      <span
        *ngIf="showFile()"
        [class]="isLight() ? 'text-amber-900/60 font-semibold' : 'text-amber-200/60 font-semibold'"
        class="absolute bottom-0.5 right-1 text-[10px] md:text-xs pointer-events-none select-none"
      >
        {{ file() }}
      </span>
      <span
        *ngIf="showRank()"
        [class]="isLight() ? 'text-amber-900/60 font-semibold' : 'text-amber-200/60 font-semibold'"
        class="absolute top-0.5 left-1 text-[10px] md:text-xs pointer-events-none select-none"
      >
        {{ rank() }}
      </span>

      <!-- Piece Rendering -->
      <app-piece
        *ngIf="piece()"
        [type]="piece()!.type"
        [color]="piece()!.color"
      ></app-piece>

      <!-- Legal Move Indicator -->
      <!-- Case 1: Empty square move dot -->
      <div
        *ngIf="isLegalMove() && !piece()"
        class="absolute w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full bg-emerald-500/50 hover:bg-emerald-500/70 transition-all scale-100 animate-pulse pointer-events-none shadow-sm"
      ></div>

      <!-- Case 2: Capture ring on enemy piece -->
      <div
        *ngIf="isLegalMove() && piece()"
        class="absolute inset-0 rounded-none ring-4 md:ring-[5px] ring-red-500/70 ring-inset pointer-events-none animate-pulse"
      ></div>
    </div>
  `,
})
export class SquareComponent {
  square = input.required<Square>();
  rank = input.required<number>();
  file = input.required<string>();
  isLight = input.required<boolean>();
  piece = input<{ type: PieceSymbol; color: Color } | null>(null);
  isSelected = input<boolean>(false);
  isLegalMove = input<boolean>(false);
  isLastMove = input<boolean>(false);
  isCheckKing = input<boolean>(false);
  showRank = input<boolean>(false);
  showFile = input<boolean>(false);

  squareClicked = output<Square>();

  onClick(): void {
    this.squareClicked.emit(this.square());
  }

  getSquareClasses(): string {
    const classes: string[] = [];

    // Base background color
    if (this.isLight()) {
      classes.push('bg-[#eedab6]');
    } else {
      classes.push('bg-[#b88b4a]');
    }

    // High priority highlights
    if (this.isCheckKing()) {
      classes.push('!bg-red-500/80 ring-4 ring-red-600 ring-inset animate-pulse');
    } else if (this.isSelected()) {
      classes.push('!bg-amber-300/80 ring-4 ring-amber-400 ring-inset');
    } else if (this.isLastMove()) {
      classes.push(this.isLight() ? '!bg-[#f7ec7d]/70' : '!bg-[#dac443]/80');
    }

    return classes.join(' ');
  }
}
