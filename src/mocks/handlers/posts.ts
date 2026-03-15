import { http, HttpResponse } from "msw";
import { mockRecordsResponse } from "../data/post";

// 직관 기록 관련 mocking 함수 모아두기
export const recordsHandler = [
  // 1. 나의 직관 기록
  // DONE: 실제 서버 API로 수정
  http.get("/api/posts", async () => {
    // 경기 일정 데이터 반환
    return HttpResponse.json(mockRecordsResponse, { status: 200 });
  }),
];
