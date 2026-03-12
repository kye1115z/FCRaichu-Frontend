import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

// 공통 UI
export default function RootLayout() {
  return (
    // DONE: Header 적용
    <div className="flex flex-col min-h-screen gap-16">
      <Header />

      <main className="flex-1 w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
