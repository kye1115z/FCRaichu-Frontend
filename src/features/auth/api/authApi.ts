import { useAuthStore } from "@/stores/useAuthStore";
import { api } from "@api/axiosInstance";

// 로그인 전후 잔여 데이터(토큰, 쿠키) 청소 유틸리티
const clearAuthGarbage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // JS로 접근 가능한 이전 세션 쿠키 날리기 (HttpOnly 제외)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

// 로그인 로직
// 1. Keycloak 로그인 페이지로 이동
// 이동 시 코드와 해싱 코드를 가지고 이동
// 2. 콜백 처리
// 코드를 액세스 토큰으로 교환하여 받음
// 3. 받은 토큰을 백엔드에 전달
// 4. zustand 스토어에 토컨 저장
// 5. 사용한 세션 데이터 삭제

/** Keycloak 리다이렉트 로그인
 * PKCE (Proof Key for Code Exchange) 방식을 사용하여 보안을 강화
 * 1. generateCodeVerifier: 랜덤한 문자열 생성
 * 2. generateCodeChallenge: codeVerifier를 해싱하여 codeChallenge 생성
 * 3. 로그인 요청 시 codeChallenge와 함께 리다이렉트
 */
export const loginWithKeycloak = async () => {
  clearAuthGarbage();
  sessionStorage.removeItem("code_verifier");
  sessionStorage.removeItem("oauth_state");

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();

  // 청소가 끝난 이후에 새로운 PKCE 데이터를 저장 (순서 중요)
  sessionStorage.setItem("code_verifier", codeVerifier);
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    response_type: "code",
    redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  });

  window.location.href = `${import.meta.env.VITE_KEYCLOAK_URL}?${params.toString()}`;
};

/** Keycloak 콜백 처리
 * 1. code, state를 URL에서 가져와서 session에 있는 것과 비교
 * 2. 백엔드에 액세스 코드 전달
 * // 2-1. user/me에 api 요청 후 404 에러 반환 시 join
 * // 2-2. join 시 닉네임과 액세스 코드만 가지고 요청
 * // 2-3. 가입 완료 시 다시 user/me 부르기 (사용자는 모르게 동작)
 */
export const handleAuthCallback = async (code: string, state: string) => {
  const savedState = sessionStorage.getItem("oauth_state");
  const codeVerifier = sessionStorage.getItem("code_verifier");

  // 중복 요청 및 재사용을 막기 위해 꺼낸 즉시 세션에서 삭제
  sessionStorage.removeItem("code_verifier");
  sessionStorage.removeItem("oauth_state");

  // state와 codeVerifier 검증
  if (state !== savedState || !codeVerifier) {
    alert("세션이 만료되었거나 잘못된 접근입니다.");
    window.location.replace("/"); // 뒤로 가기 방지
    return { status: "ERROR_REDIRECT" }; // 함수 종료
  }

  try {
    // 키클락에서 액세스 토큰 받아오기
    const tokenRes = await api.post(`/api/auth/callback`, {
      code,
      codeVerifier,
      // redirectUri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
    });
    const { accessToken } = tokenRes.data;

    // 토큰을 zustand에 저장
    const { setAuth, setUser } = useAuthStore.getState();
    setAuth(accessToken, "Bearer", "");

    try {
      // 백엔드에서 유저 정보 받아오기
      const userRes = await getUserInfo();
      setUser(userRes.data);

      // 기존 가입자는 그대로 로그인 완료 처리
      return { status: "SUCCESS" };
    } catch (error: any) {
      // 처음 등록하는 사용자
      if (error.response?.status === 404) {
        // 닉네임 입력창 띄우도록 UI에게 요청해야 함
        return { status: "NEED_SIGNUP" };
      }
      throw error;
    }
  } catch (error) {
    console.error("인증 에러", error);

    clearAuthGarbage();
    throw error;
  }
};

// 유저 정보 받아오기
export const getUserInfo = async () => {
  const userRes = await api.get(`/api/users/me`);
  return userRes;
};

// 회원가입 로직
export const postSingUp = async (nickname: string) => {
  // 닉네임을 백엔드에 보내기
  await api.post(`/api/users/join`, { nickname });

  // 유저 생성 완료되면 users/me로 다시 접근하여 정보 가져오기
  const userRes = await getUserInfo();
  useAuthStore.getState().setUser(userRes.data);

  return userRes;
};

// 닉네임 변경 로직
export const patchNickname = async (nickname: string) => {
  const res = await api.patch(`/api/users/nickname`, { nickname: nickname });
  return res;
};

// 기타 함수
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};
