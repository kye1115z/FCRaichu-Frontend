import { useState } from "react";
import type { Player } from "@/types/donation";
import { postDonation } from "@/apis/player/player";
import { useAuthStore } from "@/stores/useAuthStore";
import "./SupportModal.css";
import { getUserInfo } from "@/apis/auth/authApi";

interface SupportModalProps {
  player: Player;
  onClose: () => void;
}

export default function SupportModal({ player, onClose }: SupportModalProps) {
  const { user, updateUser } = useAuthStore();
  const [amount, setAmount] = useState<string>("");

  const handleSupport = async () => {
    const supportPoints = Number(amount);
    if (!supportPoints || supportPoints <= 0)
      return alert("금액을 정확히 입력해주세요.");

    try {
      const res = await postDonation(player.id, supportPoints);
      if (res.status === 201) {
        if (user) {
          alert(
            `${player.name} 선수에게 ${supportPoints}포인트를 후원합니다! ❤️`,
          );
          const userRes = await getUserInfo();
          updateUser({
            ...user,
            points: userRes.data.points,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#111] border border-primary/30 rounded-3xl p-10 text-white relative shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h2 className="text-primary font-black italic text-xl mb-1">
            SUPPORT FOR
          </h2>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black uppercase tracking-tighter">
              {player.name}
            </span>
            <span className="text-gray-500 font-bold mb-1">
              NO.{player.backNumber}
            </span>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-3">
              <label className="text-gray-400">후원 포인트</label>
              <span className="text-primary font-bold">
                보유: {user?.points} P
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-black border-2 border-gray-800 rounded-2xl px-6 py-4 text-2xl font-black text-right focus:outline-none focus:border-primary transition-colors pr-12"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                P
              </span>
            </div>
          </div>

          <button
            onClick={handleSupport}
            className="w-full bg-primary hover:bg-hover text-white font-black py-5 rounded-2xl transition-all transform active:scale-95 shadow-lg shadow-orange-900/20"
          >
            {amount ? Number(amount).toLocaleString() : 0} 포인트 후원하기
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          후원 완료 후에는 취소가 불가능하니 다시 한번 확인해주세요.
        </p>
      </div>
    </div>
  );
}
