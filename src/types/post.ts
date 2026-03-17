import type { Game } from "./game";

// 포스트 조회 시
export interface Post {
  postId: number;
  gameId: number;
  gameDate: string;
  title: string;
  content: string;
  images: string[];
  thumbnail: string;
  createdAt: string;
  game?: Game;
}

// 포스트 작성 시
export interface PostRequest {
  gameId: number;
  userId: number;
  title: string;
  content: string;
  images: File[]; // 나중에 file로 바꾸기
}
