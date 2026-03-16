import type { AuthResponse, User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 유저 상태
interface AuthState {
  user: User | null; // 사용자가 로그인이 아직 안 된 상태를 대비해서 null
  tokenType: string | null; // JWT 토큰 타입
  accessToken: string | null; // JWT 액세스 토큰
  isLoggedIn: () => boolean; // 로그인 여부 확인
  setAuth: (data: AuthResponse) => void; // 로그인 성공 시 호출
  updateUser: (userInfo: Partial<User>) => void;
  logout: () => void; // 로그아웃 시 호출
}

// zustand 스토어 생성
export const useAuthStore = create<AuthState>()(
  // persist = 데이터를 로컬 스토리지에 저장해서 새로고침 해도 데이터 유지 가능!
  persist(
    (set, get) => ({
      // 초기 상태값
      user: null,
      accessToken: null,
      tokenType: null,

      //   상태 변경 함수
      // 로그인: 서버에서 받은 응답(data)을 스토어에 저장
      setAuth: (data: AuthResponse) => {
        set({
          user: {
            id: data.user.id,
            userId: data.user.userId,
            nickname: data.user.nickname,
            role: data.user.role,
            points: data.user.points,
            checkPoint: data.user.checkPoint,
          },
          accessToken: data.accessToken,
          tokenType: data.grantType,
        });
      },

      updateUser: (userInfo: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userInfo },
          });
        }
      },

      isLoggedIn: () => !!get().accessToken, // 로그인 여부 확인

      // 로그아웃: 모든 인증 정보를 초기화
      logout: () =>
        set({
          user: null,
          accessToken: null,
          tokenType: null,
        }),
    }),
    { name: "auth-storage" }, // 로컬 스토리지에 저장될 키 이름
  ),
);
