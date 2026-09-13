import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ModeSelectorComponent } from './features/mode-selector/mode-selector.component';
import { ChessBoardComponent } from './features/chess-board/chess-board.component';
import { GameStatusComponent } from './features/game-controls/game-status.component';
import { GameActionsComponent } from './features/game-controls/game-actions.component';
import { MoveHistoryComponent } from './features/game-controls/move-history.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ModeSelectorComponent,
    ChessBoardComponent,
    GameStatusComponent,
    GameActionsComponent,
    MoveHistoryComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
