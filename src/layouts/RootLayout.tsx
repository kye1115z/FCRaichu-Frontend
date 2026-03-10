import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

// 공통 UI
export default function RootLayout() {
  return (
    // DONE: Header 적용
    <>
      <Header />
      <main>
        {/* 자식 라우트가 이 자리에 들어온다! 반드시 필요한 코드 */}
        <Outlet />
      </main>
    </>
  );
}
