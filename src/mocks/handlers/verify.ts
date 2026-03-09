import { http, HttpResponse } from "msw";
import { mockVerifyRequestResponse } from "../data/verify";

export const verifyHandler = [
  // 인증 요청 게시글 조회
  http.get(`/api/admin/verifications/posts`, () => {
    return HttpResponse.json({
      status: 200,
      data: mockVerifyRequestResponse,
    });
  }),

  // 티켓 인증 승인
  http.post(`/api/admin/verifications/posts/:verificationId/approve`, () => {
    return HttpResponse.json({
      status: 200,
    });
  }),

  // 티켓 인증 거절
  http.post(`/api/admin/verifications/posts/:verificationId/reject`, () => {
    return HttpResponse.json({
      status: 200,
    });
  }),
];
