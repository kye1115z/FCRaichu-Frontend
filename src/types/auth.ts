// 회원가입 POST에 필요한 데이터 타입 정의
export interface SignUpRequest {
  userId: string;
  password: string;
  nickname: string;
}

// 로그인 POST에 필요한 데이터 타입 정의
export interface LoginRequest {
  userId: string;
  password: string;
}

// 로그인 한 유저가 가지고 있을 상태
export interface User {
  id: number;
  userId: string;
  nickname: string;
  role: "USER" | "ADMIN";
  points: number;
  seasonTicket: number;
}

// 서버에서 데이터 받아올 때 타입
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}
