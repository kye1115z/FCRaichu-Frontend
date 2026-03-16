import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/auth";
import { Link } from "react-router-dom";

interface Props {
  user: User;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const UserModal = ({ user, setIsModalOpen }: Props) => {
  const { logout } = useAuthStore();
  return (
    <div className="absolute top-full right-2 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-2 z-50 animate-in fade-in zoom-in duration-150">
      <div className="px-4 py-2 border-b border-gray-50">
        <p className="text-textMain font-bold">{user.nickname}</p>
        <Link
          to="/profile/edit"
          className="text-xs text-textSub hover:text-primary transition-colors"
        >
          내 정보 수정하기 &gt;
        </Link>
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
          className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-red-50 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};
