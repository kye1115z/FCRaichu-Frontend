import Header from "@/components/common/Header";
import { useAuthStore } from "@/stores/useAuthStore";
import { use, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// 공통 UI
export default function RootLayout() {
  const [backColor, setBackColor] = useState("background");
  const [gap, setGap] = useState(16);
  const location = useLocation();
  const { user } = useAuthStore();

  // DONE: 경로에 따라 바탕 색상 바꾸기
  useEffect(() => {
    if (location.pathname !== "/signup") {
      setBackColor("background");
    } else {
      setBackColor("secondary");
    }

    if (location.pathname !== `/post/${user?.id}/all`) {
      setGap(16);
    } else {
      setGap(0);
    }
  }, [location.pathname]);

  return (
    <div className={`flex flex-col min-h-screen gap-${gap} bg-${backColor}`}>
      {/* DONE: 로그인 경로에서 헤더 없애기 */}
      {location.pathname !== "/login" && <Header />}

      <main className="flex-1 w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
