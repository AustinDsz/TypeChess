import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Current user state (defaults to Guest)
  public currentUser = signal<UserProfile>({
    id: 'guest-1',
    username: 'Guest Player',
    rating: 1200,
    gamesPlayed: 0,
    gamesWon: 0,
    isGuest: true,
  });

  public isLoggedIn = signal<boolean>(false);

  /**
   * Placeholder hook for future authentication implementation (OAuth, JWT, Firebase, etc.)
   */
  public loginWithCredentials(username: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.currentUser.set({
        id: 'user-' + Date.now(),
        username: username,
        email: `${username.toLowerCase()}@example.com`,
        rating: 1250,
        gamesPlayed: 0,
        gamesWon: 0,
        isGuest: false,
      });
      this.isLoggedIn.set(true);
      resolve(true);
    });
  }

  public logout(): void {
    this.currentUser.set({
      id: 'guest-' + Date.now(),
      username: 'Guest Player',
      rating: 1200,
      gamesPlayed: 0,
      gamesWon: 0,
      isGuest: true,
    });
    this.isLoggedIn.set(false);
  }
}
