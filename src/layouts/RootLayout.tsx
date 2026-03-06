import { Outlet } from "react-router-dom";

// 공통 UI
export default function RootLayout() {
  return (
    // TODO: Header 적용
    <main>
      {/* 자식 라우트가 이 자리에 들어온다! 반드시 필요한 코드 */}
      <Outlet />
    </main>
  );
}
