import type { Game } from "./game";

export interface Post {
  postId: number;
  gameId: number;
  title: string;
  content: string;
  images: string[];
  ticketImage: string;
  status: string;
  createdAt: string;
  game?: Game;
}
