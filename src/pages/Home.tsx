import { GameCalendar } from "@/components/home/GameCalendar";
import { Ranking } from "@/components/home/Ranking";
import { MyRecords } from "@/components/home/MyPosts";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { AttendanceCheckModal } from "@/components/common/AttendanceCheckModal";
import IntroAnimation from "@/components/landing/IntroAnimation";
import "./Home.css";

export default function Home() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 세션 storage에 'visited' 기록이 있으면 바로 false, 없으면 true
  const [isLanding, setIsLanding] = useState(
    !sessionStorage.getItem("visited"),
  );
  const [isExiting, setIsExiting] = useState(false); // 위로 올라가는 애니메이션

  useEffect(() => {
    // 만약 방문했으면 실행하지마.
    if (sessionStorage.getItem("visited")) {
      setIsLanding(false);
      return;
    }

    // 5초 동안 인트로를 보여준 뒤, 애니메이션 시작
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsLanding(false);
        sessionStorage.setItem("visited", "true"); // 방문 기록 저장
      }, 800);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 인트로가 끝나고 메인 화면이 보일 때 모달 체크
    // checkPoint가 0보다 크면 오늘 처음 로그인 한 것!
    if (isLanding === false && user) {
      if (user.checkPoint > 0) {
        setIsModalOpen(true);
      }
    }
  }, [user, isLanding]); // user나 isLanding이 변할 때마다 체크

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 랜딩 레이어 */}
      {isLanding && (
        <div
          className={`fixed inset-0 z-999 bg-white landing-layer ${isExiting ? "landing-exit" : ""}`}
        >
          <IntroAnimation />
        </div>
      )}

      {/* 메인 콘텐츠 */}
      {/* 인트로가 아예 필요 없는 방문자라면 바로 보여주고, 인트로 중이면 opacity-0 유지 */}
      <main className={`mb-60 ${!isLanding ? "content-fade-in" : "opacity-0"}`}>
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
    </div>
  );
}
