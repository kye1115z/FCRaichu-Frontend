import { http, HttpResponse } from "msw";
import { mockAttendanceRank, mockWinRateRank } from "../data/ranking";

export const rankingHandler = [
  // 직관왕 조회 api
  http.get(`/api/ranking/attendance`, () => {
    return HttpResponse.json({
      status: 200,
      data: mockAttendanceRank,
    });
  }),

  // 승률왕 조회 api
  http.get(`/api/ranking/win-rate`, () => {
    return HttpResponse.json({
      status: 200,
      data: mockWinRateRank,
    });
  }),
];
