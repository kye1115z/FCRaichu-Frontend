import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types/auth";

// 유저 상태
interface AuthState {
  user: User | null; // 사용자가 로그인이 아직 안 된 상태를 대비해서 null
  tokenType: string | null; // key cloak 토큰 타입
  accessToken: string | null; // key cloak 액세스 토큰
  refreshToken: string | null; // key cloak 리프레시 토큰
  isLoggedIn: () => boolean; // 로그인 여부 확인
  // key cloak 성공적으로 부르면 아래의 내용 받아오기
  setAuth: (
    accessToken: string,
    tokenType: string,
    refreshToken?: string,
  ) => void;
  // 서버에서 성공적으로 데이터 받아오면 아래 내용 추가하기
  setUser: (user: User) => void;
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
      refreshToken: null,
      tokenType: null,

      // 상태 변경 함수
      // 유저 정보와 토큰을 따로 나눈다.
      // 토큰 정보는 key cloak에서 받아온다.
      setAuth: (
        accessToken: string,
        tokenType: string,
        refreshToken?: string,
      ) => {
        set({
          accessToken,
          tokenType,
          refreshToken: refreshToken || get().refreshToken,
        });
      },

      setUser: (user: User) => {
        set({
          user: {
            id: user.id,
            userId: user.userId,
            nickname: user.nickname,
            role: user.role,
            points: user.points,
            checkPoint: user.checkPoint,
          },
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
          refreshToken: null,
          tokenType: null,
        }),
    }),
    { name: "auth-storage" }, // 로컬 스토리지에 저장될 키 이름
  ),
);
