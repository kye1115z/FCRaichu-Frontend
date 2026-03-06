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
