import { PieceSymbol, Color, Square as ChessJsSquare } from 'chess.js';

export type Square = ChessJsSquare;

export interface BoardPiece {
  type: PieceSymbol;
  color: Color;
  square: Square;
}

export interface MoveInfo {
  from: Square;
  to: Square;
  piece: PieceSymbol;
  color: Color;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
  san: string;
  flags: string;
}

export type GameMode = 'pass-and-play' | 'ai-disabled';

export interface CapturedPieces {
  w: PieceSymbol[]; // Pieces captured by White (i.e. black pieces removed)
  b: PieceSymbol[]; // Pieces captured by Black (i.e. white pieces removed)
  materialAdvantage: {
    color: Color | null;
    score: number;
  };
}

export interface PromotionState {
  from: Square;
  to: Square;
  color: Color;
}
