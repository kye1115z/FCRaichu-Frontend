import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/auth";
import { useEffect, useState } from "react";
import { NicknameEditModal } from "./NicknameEditModal";
import { getUserInfo } from "@/apis/auth/authApi";

interface Props {
  user: User;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const UserModal = ({ user, setIsModalOpen }: Props) => {
  const { updateUser, logout } = useAuthStore();
  // 모달 열 때 user 정보 불러와서 points 업데이트 해주기
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserInfo();
      if (res.status == 200) {
        updateUser({
          ...user,
          points: res.data.points,
        });
      }
    };

    fetchUser();
  }, []);

  // 닉네임 변경 모달을 위해서
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <>
      <div className="absolute top-full right-2 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-2 z-50 animate-in fade-in zoom-in duration-150">
        <div className="px-4 py-2 border-b border-gray-50">
          <p className="text-textMain font-bold">{user.nickname}</p>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-textSub hover:text-primary transition-colors cursor-pointer outline-none"
          >
            내 정보 수정하기 &gt;
          </button>
        </div>

        <div className="px-4 py-3 flex justify-between items-center text-sm">
          <span className="text-textSub">내 포인트</span>
          <span className="font-bold text-primary">
            {user.points?.toLocaleString() ?? 0} P
          </span>
        </div>

        <div className="border-t border-gray-50 mt-1">
          <button
            onClick={() => {
              logout();
              setIsModalOpen(false);
              alert("로그아웃 되었습니다.");
            }}
            className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-red-50 transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 닉네임 변경 모달 */}
      {isEditModalOpen && (
        <NicknameEditModal
          currentNickname={user.nickname}
          onClose={() => {
            setIsEditModalOpen(false); // 수정 모달 닫기
            setIsModalOpen(false); // 수정한 후 메인 모달도 닫고 싶다면 추가
          }}
        />
      )}
    </>
  );
};
