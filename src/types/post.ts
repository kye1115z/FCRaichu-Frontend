import type { Game } from "./game";

// 포스트 조회 시
export interface Post {
  postId: number;
  gameId: number;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  game?: Game;
}

// 포스트 작성 시
export interface PostRequest {
  gameId: number;
  userId: number;
  title: string;
  content: string;
  images: String[]; // 나중에 file로 바꾸기
}
