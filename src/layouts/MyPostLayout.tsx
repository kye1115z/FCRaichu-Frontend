// 나의 전체 포스트 / 상세 포스트 조회
import { Outlet } from "react-router-dom";

export default function MyPostLayout() {
  return (
    <main className="flex-1 w-full mx-auto">
      <Outlet />
    </main>
  );
}
