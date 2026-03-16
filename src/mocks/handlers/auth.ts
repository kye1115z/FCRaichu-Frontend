import { http, HttpResponse } from "msw";
import { mockLoginReponse } from "../data/auth";

// auth 관련 mocking 함수 모아두기
export const signUpHandler = [
  // 1. 회원가입 - /api/users 로 들어오는 요청을 모킹한다.
  http.post("/api/users/join", async () => {
    // 성공하면 201 상태코드와 빈 응답을 반환.
    return HttpResponse.json(null, { status: 201 });
  }),

  // 2. 로그인 - /api/users/login 으로 들어오는 요청을 모킹.
  http.post("/api/users/login", async () => {
    return HttpResponse.json(mockLoginReponse, { status: 200 });
  }),

  // 3. 닉네임 변경
  http.patch("/api/users/nickname", async () => {
    return HttpResponse.json(null, { status: 200 });
  }),
];
