// 랭킹에 띄울 유저 타입 정의
export interface RankingUser {
  id: number; // 유저 아이디
  rank: number;
  nickname: string;
  count: number; // 직관/승률 횟수
}

// 직관왕/승률왕 리스트
export interface RankingResponse {
  attendanceRank: RankingUser[];
  winRateRank: RankingUser[];
}
