import { Outlet } from "react-router-dom";

// 공통 UI
export default function LandingLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
