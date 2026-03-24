import type { LoginRequest, SignUpRequest } from "@/features/auth/types/auth";
import { api } from "@api/axiosInstance";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

// 로그인 로직
// 1. key cloak에 아이디와 비밀번호를 보내서 액세스 토큰과 리프레시 토큰을 받아온다.
// 2. 액세스 토큰을 가지고 서버에 get 요청을 한다.
// 3. 만약 액세스 토큰으로 접근했는데 서버로부터 특정 에러가 나면?
// 3-1. 아까 받아온 리프레시 토큰으로 다시 액세스 토큰을 받아온다.
// 3-2. 액세스 토큰을 가지고 다시 서버에 접근한다.

// Keycloak에서 토큰을 받아오는 내부 함수
export const getLogin = async (data: LoginRequest) => {
  const params = new URLSearchParams();
  params.append("client_id", "test-client");
  params.append("username", data.userId);
  params.append("password", data.password);
  params.append("grant_type", "password");

  const keycloakRes = await axios.post(
    "https://raichu.inwoohub.com/auth/realms/fcraichu/protocol/openid-connect/token",
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );

  // key cloak 응답에서 토큰을 추출한다.
  const { access_token, token_type, refresh_token } = keycloakRes.data;

  // zustand 스토어에 토큰 저장
  const { setAuth, setUser } = useAuthStore.getState();
  setAuth(access_token, token_type, refresh_token);

  // 저장된 토큰으로 내 정보 요청 (로그인!!!!!!!!!! ⭐️)
  const userRes = await api.get(`/api/users/me`);

  // 유저 정보도 스토어에 저장
  setUser(userRes.data);

  return userRes.data;
};

// 유저 정보 받아오기
export const getUserInfo = async () => {
  const userRes = await api.get(`/api/users/me`);
  return userRes;
};

// 회원가입 로직
export const postSingUp = async (data: SignUpRequest) => {
  const res = await api.post(`/api/users/join`, data);
  return res;
};

// 닉네임 변경 로직
export const patchNickname = async (nickname: string) => {
  const res = await api.patch(`/api/users/nickname`, { nickname: nickname });
  return res;
};
