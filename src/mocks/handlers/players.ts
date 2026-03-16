import { http, HttpResponse } from "msw";
import { mockPlayerData } from "../data/players";

// 선수 관련 mocking 함수 모아두기
export const playersHandler = [
  // 1. 현역 선수 정보 가져오가
  http.get("/api/players/active", async () => {
    // 경기 일정 데이터 반환
    return HttpResponse.json(mockPlayerData, { status: 200 });
  }),
];
