import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, PieceSymbol } from 'chess.js';
import { Square } from '../../../core/models/chess.models';
import { PieceComponent } from '../piece/piece.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [CommonModule, PieceComponent],
  template: `
    <div
      (click)="onClick()"
      [class]="getSquareClasses()"
      class="relative w-full h-full flex items-center justify-center select-none cursor-pointer transition-all duration-100"
    >
      <!-- Coordinate Labels: File on bottom rank, Rank on leftmost file -->
      <span
        *ngIf="showFile()"
        [class]="getCoordinateClass()"
        class="absolute bottom-0.5 right-1 text-[10px] md:text-xs pointer-events-none select-none font-bold tracking-tight"
      >
        {{ file() }}
      </span>
      <span
        *ngIf="showRank()"
        [class]="getCoordinateClass()"
        class="absolute top-0.5 left-1 text-[10px] md:text-xs pointer-events-none select-none font-bold tracking-tight"
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
        class="absolute w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full bg-emerald-500/60 dark:bg-emerald-400/70 hover:scale-110 transition-all scale-100 animate-pulse pointer-events-none shadow-md"
      ></div>

      <!-- Case 2: Capture ring on enemy piece -->
      <div
        *ngIf="isLegalMove() && piece()"
        class="absolute inset-0 rounded-none ring-4 md:ring-[5px] ring-red-500/80 ring-inset pointer-events-none animate-pulse"
      ></div>
    </div>
  `,
})
export class SquareComponent {
  private themeService = inject(ThemeService);

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

  getCoordinateClass(): string {
    const isDarkTheme = this.themeService.theme() === 'dark';
    if (isDarkTheme) {
      return this.isLight() ? 'text-slate-400/80' : 'text-slate-600/80';
    } else {
      return this.isLight() ? 'text-amber-900/60' : 'text-amber-100/80';
    }
  }

  getSquareClasses(): string {
    const isDarkTheme = this.themeService.theme() === 'dark';
    const classes: string[] = [];

    // Base background colors
    if (isDarkTheme) {
      // Midnight AMOLED palette: Deep Slate Light squares vs Pure Midnight Dark squares
      if (this.isLight()) {
        classes.push('bg-[#242b38]');
      } else {
        classes.push('bg-[#10141c]');
      }
    } else {
      // Clean Classic Tournament Wood palette
      if (this.isLight()) {
        classes.push('bg-[#f0d9b5]');
      } else {
        classes.push('bg-[#b58863]');
      }
    }

    // High priority highlights
    if (this.isCheckKing()) {
      classes.push('!bg-red-500/85 ring-4 ring-red-600 ring-inset animate-pulse');
    } else if (this.isSelected()) {
      classes.push('!bg-amber-400/80 dark:!bg-amber-500/70 ring-4 ring-amber-400 ring-inset');
    } else if (this.isLastMove()) {
      if (isDarkTheme) {
        classes.push(this.isLight() ? '!bg-[#3c4424]' : '!bg-[#2b3318]');
      } else {
        classes.push(this.isLight() ? '!bg-[#f7ec7d]' : '!bg-[#dac443]');
      }
    }

    return classes.join(' ');
  }
}
