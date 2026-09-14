export type AiDifficulty = 'easy' | 'medium' | 'hard';

export interface AiMoveRequest {
  fen: string;
  history: string[];
  legalMoves: string[]; // List of legal SAN or UCI moves
  difficulty: AiDifficulty;
  playerColor: 'w' | 'b';
  aiColor: 'w' | 'b';
}

export interface AiMoveResponse {
  move: string;
  commentary?: string;
  isFallback?: boolean;
}
