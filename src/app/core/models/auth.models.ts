export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  rating: number;
  gamesPlayed: number;
  gamesWon: number;
  isGuest: boolean;
}
