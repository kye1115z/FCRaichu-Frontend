import Header from "@/components/common/Header";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// 공통 UI
export default function RootLayout() {
  const [backColor, setBackColor] = useState("secondary");
  const location = useLocation();

  // DONE: 경로에 따라 바탕 색상 바꾸기
  useEffect(() => {
    if (location.pathname !== "/signup") {
      setBackColor("background");
    } else {
      setBackColor("secondary");
    }
  }, [location.pathname]);

  return (
    <div className={`flex flex-col min-h-screen gap-16 bg-${backColor}`}>
      {/* DONE: 로그인 경로에서 헤더 없애기 */}
      {location.pathname !== "/login" && <Header />}

      <main className="flex-1 w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
