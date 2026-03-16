import Header from "@/components/common/Header";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// 공통 UI
export default function RootLayout() {
  const [backColor, setBackColor] = useState("background");
  const location = useLocation();
  const { user } = useAuthStore();
  const isPostPath = location.pathname.startsWith(`/post/${user?.id}`);

  // DONE: 경로에 따라 바탕 색상 바꾸기
  useEffect(() => {
    if (location.pathname !== "/signup") {
      setBackColor("background");
    } else {
      setBackColor("secondary");
    }
  }, [location.pathname]);

  return (
    <div
      className={`flex flex-col min-h-screen gap-${isPostPath || location.pathname === "/donation" ? "0" : "16"} bg-${backColor}`}
    >
      {/* DONE: 로그인 경로에서 헤더 없애기 */}
      {location.pathname !== "/login" && <Header />}

      <main className="flex-1 w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
