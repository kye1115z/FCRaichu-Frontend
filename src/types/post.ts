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

// 인증 시 조회하는 글 데이터 타입
export interface PostVerification {
  verificationId: number;
  postId: number;
  nickname: string;
  gameId: number;
  gameTitle: string;
  ticketImage: string;
  status: VerificationStatus;
  createdAt: Date;
}

export type TicketType = "시즌권" | "일반 티켓";

export interface VerificationStatus {
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}
