import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, PieceSymbol } from 'chess.js';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex items-center justify-center select-none pointer-events-none transition-transform duration-150 transform hover:scale-105">
      <!-- White King -->
      <svg *ngIf="color() === 'w' && type() === 'k'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter" />
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5 23.5C20 16 10.5 13 6.5 19.5c-3 6 6 10.5 6 10.5v7z" fill="#fff" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
        </g>
      </svg>

      <!-- Black King -->
      <svg *ngIf="color() === 'b' && type() === 'k'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22.5 11.63V6" stroke-linejoin="miter" />
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1c1917" stroke-linecap="butt" stroke-linejoin="miter" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23.5 23.5C20 16 10.5 13 6.5 19.5c-3 6 6 10.5 6 10.5v7z" fill="#1c1917" />
          <path d="M20 8h5" stroke-linejoin="miter" />
          <path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01-.01C20 18 10.85 14 6.97 19.85 4.5 25.5 13 29.5 13 29.5" stroke="#fff" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff" />
        </g>
      </svg>

      <!-- White Queen -->
      <svg *ngIf="color() === 'w' && type() === 'q'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" stroke-linecap="butt" />
          <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt" />
          <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt" />
          <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0" fill="none" />
        </g>
      </svg>

      <!-- Black Queen -->
      <svg *ngIf="color() === 'b' && type() === 'q'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="#1c1917" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" stroke-linecap="butt" />
          <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt" />
          <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt" stroke="#fff" />
          <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0" fill="none" stroke="#fff" />
        </g>
      </svg>

      <!-- White Rook -->
      <svg *ngIf="color() === 'w' && type() === 'r'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm2.5-4l1.5-16.5h13L30.5 32h-16zM9 11.5h27V15H9v-3.5z" stroke-linecap="butt" />
          <path d="M12 11.5V6.5h4v3h5v-3h4v3h5v-3h4v5H12z" stroke-linecap="butt" />
          <path d="M11 14h23M14 26.5h17M13 32h19M11 36h23" fill="none" />
        </g>
      </svg>

      <!-- Black Rook -->
      <svg *ngIf="color() === 'b' && type() === 'r'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="#1c1917" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm2.5-4l1.5-16.5h13L30.5 32h-16zM9 11.5h27V15H9v-3.5z" stroke-linecap="butt" />
          <path d="M12 11.5V6.5h4v3h5v-3h4v3h5v-3h4v5H12z" stroke-linecap="butt" />
          <path d="M14 29.5v-13h17v13H14z" fill="none" stroke="#fff" stroke-linejoin="miter" />
          <path d="M14 16.5L12.5 32h20L31 16.5H14z" fill="#1c1917" />
          <path d="M11 14h23M14 26.5h17M13 32h19M11 36h23" fill="none" stroke="#fff" />
        </g>
      </svg>

      <!-- White Bishop -->
      <svg *ngIf="color() === 'w' && type() === 'b'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <g fill="#fff" stroke-linecap="butt">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
          </g>
          <path d="M17.5 26h10M15 30h15M22.5 10v4M20 12h5" />
          <path d="M24.5 15.5c2 2.5 4 5 4 8" stroke-linecap="butt" />
        </g>
      </svg>

      <!-- Black Bishop -->
      <svg *ngIf="color() === 'b' && type() === 'b'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <g fill="#1c1917" stroke-linecap="butt">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
          </g>
          <path d="M17.5 26h10M15 30h15M22.5 10v4M20 12h5" stroke="#fff" />
          <path d="M24.5 15.5c2 2.5 4 5 4 8" stroke="#fff" stroke-linecap="butt" />
        </g>
      </svg>

      <!-- White Knight -->
      <svg *ngIf="color() === 'w' && type() === 'n'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" />
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-4.04 0-5-1-1-.87 2.52-2 1-1-1 0-3 1-3.5 1-.5 2.5 1.5 3.5 1.5 1.5 0 3-1.5 3-1.5s.5-1.5-.5-3c-1.5-2-4.5-2.5-5.5-4.5-.5-1 .5-2 1.5-2 1.5 0 2.5 1 3 1.5 1.5 1.5 2.5 1 4 .5 1.5-.5 3-3 3-3" fill="#fff" />
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5-12.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#000" stroke="#000" />
          <path d="M24.55 10.4s-.45 1.45-1.55 1.6M14.5 15.5s1 1 2 0m-.5-3s.5 1.5 1.5 1.5" />
        </g>
      </svg>

      <!-- Black Knight -->
      <svg *ngIf="color() === 'b' && type() === 'n'" viewBox="0 0 45 45" class="w-4/5 h-4/5 drop-shadow-md">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1c1917" />
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-4.04 0-5-1-1-.87 2.52-2 1-1-1 0-3 1-3.5 1-.5 2.5 1.5 3.5 1.5 1.5 0 3-1.5 3-1.5s.5-1.5-.5-3c-1.5-2-4.5-2.5-5.5-4.5-.5-1 .5-2 1.5-2 1.5 0 2.5 1 3 1.5 1.5 1.5 2.5 1 4 .5 1.5-.5 3-3 3-3" fill="#1c1917" />
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5-12.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#fff" stroke="#fff" />
          <path d="M24.55 10.4s-.45 1.45-1.55 1.6M14.5 15.5s1 1 2 0m-.5-3s.5 1.5 1.5 1.5" stroke="#fff" />
        </g>
      </svg>

      <!-- White Pawn -->
      <svg *ngIf="color() === 'w' && type() === 'p'" viewBox="0 0 45 45" class="w-3/4 h-3/4 drop-shadow-md">
        <path d="M22.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7zm0 9c-2.5 0-5 2.5-5 5 0 2 1.5 3.5 2.5 5.5l-3 6.5h11l-3-6.5c1-2 2.5-3.5 2.5-5.5 0-2.5-2.5-5-5-5zm-7.5 18h15v3h-15v-3z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- Black Pawn -->
      <svg *ngIf="color() === 'b' && type() === 'p'" viewBox="0 0 45 45" class="w-3/4 h-3/4 drop-shadow-md">
        <path d="M22.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7zm0 9c-2.5 0-5 2.5-5 5 0 2 1.5 3.5 2.5 5.5l-3 6.5h11l-3-6.5c1-2 2.5-3.5 2.5-5.5 0-2.5-2.5-5-5-5zm-7.5 18h15v3h-15v-3z" fill="#1c1917" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  `,
})
export class PieceComponent {
  type = input.required<PieceSymbol>();
  color = input.required<Color>();
}
