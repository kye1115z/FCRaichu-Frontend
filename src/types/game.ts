export interface Game {
  id: number;
  date: Date;
  round: number;
  homeTeam: string;
  awayTeam: string;
  opponent: string;
  stadium: string;
  isAttended: boolean;
}
