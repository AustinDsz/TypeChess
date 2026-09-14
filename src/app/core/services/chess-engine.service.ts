import { Injectable, inject, signal, computed } from '@angular/core';
import { Chess, PieceSymbol, Color } from 'chess.js';
import { MoveInfo, Square, GameMode, CapturedPieces, PromotionState } from '../models/chess.models';
import { AudioService } from './audio.service';
import { AiService } from './ai.service';

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

@Injectable({
  providedIn: 'root',
})
export class ChessEngineService {
  private audioService = inject(AudioService);
  public aiService = inject(AiService);
  private chess = new Chess();

  // Reactive State Signals
  public gameMode = signal<GameMode>('pass-and-play');
  public isFlipped = signal<boolean>(false);
  public board = signal<({ type: PieceSymbol; color: Color; square: Square } | null)[][]>(this.chess.board());
  public turn = signal<Color>(this.chess.turn());
  public selectedSquare = signal<Square | null>(null);
  public legalMoves = signal<Square[]>([]);
  public lastMove = signal<{ from: Square; to: Square } | null>(null);
  public pendingPromotion = signal<PromotionState | null>(null);
  
  // Game Status Signals
  public isCheck = signal<boolean>(false);
  public isCheckmate = signal<boolean>(false);
  public isStalemate = signal<boolean>(false);
  public isDraw = signal<boolean>(false);
  public isGameOver = signal<boolean>(false);
  public moveHistory = signal<MoveInfo[]>([]);
  public capturedPieces = signal<CapturedPieces>({
    w: [],
    b: [],
    materialAdvantage: { color: null, score: 0 },
  });

  // Computed status message
  public statusMessage = computed(() => {
    if (this.isCheckmate()) {
      const winner = this.turn() === 'w' ? 'Black' : 'White';
      return `Checkmate! ${winner} wins!`;
    }
    if (this.isStalemate()) {
      return 'Draw by Stalemate!';
    }
    if (this.isDraw()) {
      return 'Game drawn!';
    }
    if (this.isCheck()) {
      const activeColor = this.turn() === 'w' ? 'White' : 'Black';
      return `Check! ${activeColor} is in check.`;
    }
    if (this.gameMode() === 'play-vs-ai') {
      if (this.aiService.isAiThinking()) {
        return 'Gemini AI is thinking...';
      }
      return this.turn() === this.aiService.aiColor() ? 'AI is moving...' : 'Your turn';
    }
    return this.turn() === 'w' ? "White's turn" : "Black's turn";
  });

  constructor() {
    this.syncState();
  }

  public setGameMode(mode: GameMode) {
    this.gameMode.set(mode);
    this.resetGame();
    if (mode === 'play-vs-ai' && this.aiService.aiColor() === 'w') {
      this.triggerAiTurn();
    }
  }

  public toggleFlip() {
    this.isFlipped.update((flipped) => !flipped);
  }

  public resetGame() {
    this.chess.reset();
    this.selectedSquare.set(null);
    this.legalMoves.set([]);
    this.lastMove.set(null);
    this.pendingPromotion.set(null);
    this.aiService.aiCommentary.set(null);
    this.syncState();

    if (this.gameMode() === 'play-vs-ai' && this.aiService.aiColor() === 'w') {
      this.triggerAiTurn();
    }
  }

  public undoMove() {
    if (this.chess.history().length === 0 || this.aiService.isAiThinking()) return;
    
    // In play vs AI mode, undo 2 moves (Player move + AI move) so it remains player's turn
    if (this.gameMode() === 'play-vs-ai' && this.chess.history().length >= 2) {
      this.chess.undo();
      this.chess.undo();
    } else {
      this.chess.undo();
    }

    this.selectedSquare.set(null);
    this.legalMoves.set([]);
    
    const history = this.chess.history({ verbose: true });
    if (history.length > 0) {
      const last = history[history.length - 1];
      this.lastMove.set({ from: last.from as Square, to: last.to as Square });
    } else {
      this.lastMove.set(null);
    }
    
    this.syncState();
    this.audioService.playSound('move');
  }

  public handleSquareClick(square: Square): void {
    if (this.isGameOver() || this.pendingPromotion() || this.aiService.isAiThinking()) {
      return;
    }

    // If it's vs AI mode and not player's turn, ignore clicks
    if (this.gameMode() === 'play-vs-ai' && this.turn() === this.aiService.aiColor()) {
      return;
    }

    const currentSelection = this.selectedSquare();
    const pieceOnSquare = this.chess.get(square);

    // If square is already selected, unselect
    if (currentSelection === square) {
      this.clearSelection();
      return;
    }

    // If we already selected a piece and clicked on a valid legal destination
    if (currentSelection && this.legalMoves().includes(square)) {
      const movingPiece = this.chess.get(currentSelection);
      
      // Check if it's a pawn promotion
      if (
        movingPiece &&
        movingPiece.type === 'p' &&
        ((movingPiece.color === 'w' && square.endsWith('8')) ||
         (movingPiece.color === 'b' && square.endsWith('1')))
      ) {
        // Trigger promotion modal
        this.pendingPromotion.set({
          from: currentSelection,
          to: square,
          color: movingPiece.color,
        });
        return;
      }

      this.executeMove(currentSelection, square);
      return;
    }

    // Selecting a piece of current turn's color
    if (pieceOnSquare && pieceOnSquare.color === this.turn()) {
      this.selectedSquare.set(square);
      const moves = this.chess.moves({ square, verbose: true });
      this.legalMoves.set(moves.map((m) => m.to as Square));
      return;
    }

    // Clicked elsewhere
    this.clearSelection();
  }

  public completePromotion(promotionPiece: PieceSymbol): void {
    const promotion = this.pendingPromotion();
    if (!promotion) return;

    this.pendingPromotion.set(null);
    this.executeMove(promotion.from, promotion.to, promotionPiece);
  }

  public cancelPromotion(): void {
    this.pendingPromotion.set(null);
    this.clearSelection();
  }

  private executeMove(from: Square, to: Square, promotion?: PieceSymbol): boolean {
    try {
      const moveResult = this.chess.move({
        from,
        to,
        promotion: promotion || 'q',
      });

      if (!moveResult) {
        this.audioService.playSound('illegal');
        this.clearSelection();
        return false;
      }

      this.lastMove.set({ from, to });
      this.clearSelection();
      this.syncState();

      // Trigger appropriate sound effect
      if (this.isCheckmate() || this.isDraw() || this.isStalemate()) {
        this.audioService.playSound('gameover');
      } else if (this.isCheck()) {
        this.audioService.playSound('check');
      } else if (moveResult.captured) {
        this.audioService.playSound('capture');
      } else {
        this.audioService.playSound('move');
      }

      // Check if next turn belongs to AI
      if (!this.isGameOver() && this.gameMode() === 'play-vs-ai' && this.turn() === this.aiService.aiColor()) {
        this.triggerAiTurn();
      }

      return true;
    } catch {
      this.audioService.playSound('illegal');
      this.clearSelection();
      return false;
    }
  }

  public async triggerAiTurn(): Promise<void> {
    if (this.isGameOver()) return;

    const fen = this.chess.fen();
    const history = this.chess.history();
    const legalMoves = this.chess.moves();

    if (legalMoves.length === 0) return;

    const aiMoveSanOrUci = await this.aiService.getAiMove(fen, history, legalMoves);

    if (aiMoveSanOrUci && !this.isGameOver()) {
      try {
        const moveRes = this.chess.move(aiMoveSanOrUci);
        if (moveRes) {
          this.lastMove.set({ from: moveRes.from as Square, to: moveRes.to as Square });
          this.syncState();

          if (this.isCheckmate() || this.isDraw() || this.isStalemate()) {
            this.audioService.playSound('gameover');
          } else if (this.isCheck()) {
            this.audioService.playSound('check');
          } else if (moveRes.captured) {
            this.audioService.playSound('capture');
          } else {
            this.audioService.playSound('move');
          }
        }
      } catch (e) {
        console.error('Error applying AI move:', e);
      }
    }
  }

  public clearSelection(): void {
    this.selectedSquare.set(null);
    this.legalMoves.set([]);
  }

  private syncState(): void {
    this.board.set(this.chess.board());
    this.turn.set(this.chess.turn());
    this.isCheck.set(this.chess.isCheck());
    this.isCheckmate.set(this.chess.isCheckmate());
    this.isStalemate.set(this.chess.isStalemate());
    this.isDraw.set(this.chess.isDraw());
    this.isGameOver.set(this.chess.isGameOver());

    const history = this.chess.history({ verbose: true }) as MoveInfo[];
    this.moveHistory.set(history);

    this.calculateCapturedPieces(history);
  }

  private calculateCapturedPieces(history: MoveInfo[]): void {
    const capturedByWhite: PieceSymbol[] = [];
    const capturedByBlack: PieceSymbol[] = [];
    let whiteScore = 0;
    let blackScore = 0;

    for (const move of history) {
      if (move.captured) {
        if (move.color === 'w') {
          capturedByWhite.push(move.captured);
          whiteScore += PIECE_VALUES[move.captured] || 0;
        } else {
          capturedByBlack.push(move.captured);
          blackScore += PIECE_VALUES[move.captured] || 0;
        }
      }
    }

    let advColor: Color | null = null;
    let diff = 0;

    if (whiteScore > blackScore) {
      advColor = 'w';
      diff = whiteScore - blackScore;
    } else if (blackScore > whiteScore) {
      advColor = 'b';
      diff = blackScore - whiteScore;
    }

    this.capturedPieces.set({
      w: capturedByWhite,
      b: capturedByBlack,
      materialAdvantage: {
        color: advColor,
        score: diff,
      },
    });
  }
}
