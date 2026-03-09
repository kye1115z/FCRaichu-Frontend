import { http, HttpResponse } from "msw";
import { mockRankingData } from "../data/ranking";

export const rankingHandler = [
  // 랭킹 조회 api
  http.get(`/api/ranking`, () => {
    return HttpResponse.json({
      status: 200,
      data: mockRankingData,
    });
  }),
];
