import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

// [axios 기본 세팅!] 모든 파일에서 똑같은 규칙을 공유할 수 있도록.
export const api = axios.create({
  // TODO: 배포 환경에서 잘 작동하는지 확인
  // (npm run dev 에서는 자동으로 .env.development 로 연결됨)
  baseURL: import.meta.env.VITE_API_URL, // .env에서 설정한 주소 사용
  timeout: 5000, // 응답 대기 5초
});

// [보내는 요청 인터셉트!] 서버로 요청을 "보내기" 전에 인터셉트!
api.interceptors.request.use(
  (config) => {
    // zustand 스토어에 저장되어 있는 최신 토큰을 가져옴.
    const { accessToken, tokenType } = useAuthStore.getState();

    // 토큰 있으면? 헤더에 실어줌
    if (accessToken) {
      config.headers.Authorization = `${tokenType} ${accessToken}`;
    }

    // 요청 보냄
    return config;
  },
  //   에러 난 경우
  (error) => {
    return Promise.reject(error);
  },
);

// 액세스 토큰에 접근했는데 에러가 나면???
api.interceptors.response.use(
  (response) => response, // 성공 시 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(토큰 만료)가 발생했고, 재시도한 적이 없는 요청일 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const { refreshToken, setAuth } = useAuthStore.getState();

        // 리프레시 토큰으로 새 액세스 토큰 요청
        const params = new URLSearchParams();
        params.append("client_id", "react");
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken || "");

        const res = await axios.post(
          "https://raichu.inwoohub.com/auth/realms/fcraichu/protocol/openid-connect/token",
          params,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        );

        const {
          access_token,
          refresh_token: new_refresh_token,
          token_type,
        } = res.data;

        // 새 토큰 저장
        setAuth(access_token, token_type, new_refresh_token);

        // 실패했던 원래 요청의 헤더를 새 토큰으로 갈아끼우고 재요청
        originalRequest.headers.Authorization = `${token_type} ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰까지 만료된 경우 (진짜 로그아웃)
        useAuthStore.getState().logout();
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
