import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AiDifficulty, AiMoveRequest, AiMoveResponse } from '../models/ai.models';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private http = inject(HttpClient);

  public isAiThinking = signal<boolean>(false);
  public aiCommentary = signal<string | null>(null);
  public difficulty = signal<AiDifficulty>('medium');
  public aiColor = signal<'w' | 'b'>('b');

  public setDifficulty(diff: AiDifficulty) {
    this.difficulty.set(diff);
  }

  public setAiColor(color: 'w' | 'b') {
    this.aiColor.set(color);
  }

  public async getAiMove(
    fen: string,
    history: string[],
    legalMoves: string[]
  ): Promise<string | null> {
    if (!legalMoves || legalMoves.length === 0) return null;

    this.isAiThinking.set(true);

    const payload: AiMoveRequest = {
      fen,
      history,
      legalMoves,
      difficulty: this.difficulty(),
      playerColor: this.aiColor() === 'b' ? 'w' : 'b',
      aiColor: this.aiColor(),
    };

    try {
      // Calls the Cloudflare Pages Function backend proxy
      const response = await firstValueFrom(
        this.http.post<AiMoveResponse>('/api/ai-move', payload)
      );

      if (response && response.move) {
        if (response.commentary) {
          this.aiCommentary.set(response.commentary);
        }
        return response.move;
      }
    } catch (err) {
      console.warn('Backend AI proxy error, using local fallback:', err);
    } finally {
      this.isAiThinking.set(false);
    }

    // Client-side emergency fallback if offline or backend fails
    const fallbackMove = this.localFallbackMove(legalMoves, this.difficulty());
    this.aiCommentary.set('Making a tactical calculation.');
    return fallbackMove;
  }

  private localFallbackMove(legalMoves: string[], difficulty: AiDifficulty): string {
    const tactical = legalMoves.filter((m) => m.includes('x') || m.includes('+') || m.includes('#'));
    if (difficulty === 'hard' && tactical.length > 0) {
      return tactical[Math.floor(Math.random() * tactical.length)];
    }
    if (difficulty === 'medium' && tactical.length > 0 && Math.random() > 0.4) {
      return tactical[Math.floor(Math.random() * tactical.length)];
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }
}
