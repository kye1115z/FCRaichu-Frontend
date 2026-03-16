import { GameCalendar } from "@/components/home/GameCalendar";
import { Ranking } from "@/components/home/Ranking";
import { MyRecords } from "@/components/home/MyPosts";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { AttendanceCheckModal } from "@/components/common/AttendanceCheckModal";

export default function Home() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // checkPoint가 0보다 크면 오늘 처음 로그인 한 것!
    if (user && user.checkPoint > 0) {
      setIsModalOpen(true);
    }
  }, [user]);

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="mb-60">
      {/* 캘린더 */}
      <GameCalendar />
      {/* 직관 기록 */}
      <MyRecords />
      {/* 직관왕 / 승률왕 */}
      <Ranking />

      {isModalOpen && (
        <AttendanceCheckModal
          point={user?.checkPoint || 0}
          onClose={closeModal}
        />
      )}
    </main>
  );
}
