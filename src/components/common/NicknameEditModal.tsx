import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import { IoClose } from "react-icons/io5";
import { patchNickname } from "@/apis/auth/authApi";

interface Props {
  currentNickname: string;
  onClose: () => void;
}

export const NicknameEditModal = ({ currentNickname, onClose }: Props) => {
  const [newNickname, setNewNickname] = useState(currentNickname);
  const { user } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);

  const trimmedNickname = newNickname.trim();
  const hasWhitespace = /\s/.test(newNickname);

  const isDisabled =
    !trimmedNickname ||
    trimmedNickname === currentNickname ||
    hasWhitespace;

  const handleUpdate = async () => {
    if (isDisabled) return;

    try {
      const res = await patchNickname(trimmedNickname);
      if (res.status === 200) {
        if (user) {
          updateUser({ nickname: trimmedNickname });
        }
        alert("닉네임이 변경되었습니다.");
        onClose();
      }
    } catch (e) {
      alert("변경에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-80 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="body-lg" className="font-bold!">
            닉네임 수정
          </Typography>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-textMain cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-textSub ml-1">새로운 닉네임</label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full p-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              autoFocus
            />

            {hasWhitespace && (
              <p className="text-xs text-red-500 ml-1">
                닉네임에는 공백을 포함할 수 없습니다.
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-textSub bg-gray-100 rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              disabled={isDisabled}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-md
                ${
                  isDisabled
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-primary text-white hover:bg-hover cursor-pointer"
                }`}
            >
              변경하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
