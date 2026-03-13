import { http, HttpResponse } from "msw";
import { mockGameResponse, mockScheduleResponse } from "../data/game";

// 경기 관련 mocking 함수 모아두기
export const gamesHandler = [
  // 1. 경기 일정 Get
  // DONE: 실제 서버 API로 수정
  http.get("/api/games", async () => {
    // 경기 일정 데이터 반환
    return HttpResponse.json(mockScheduleResponse, { status: 200 });
  }),

  http.get("/api/games/:id", async () => {
    // 경기 일정 데이터 반환
    return HttpResponse.json(mockGameResponse, { status: 200 });
  }),
];
