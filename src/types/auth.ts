// 로그인 한 유저가 가지고 있을 상태
export interface User {
  id: number;
  userId: string;
  nickname: string;
  role: "USER" | "ADMIN";
  points: number;
}

// 서버에서 데이터 받아올 때 타입
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}
