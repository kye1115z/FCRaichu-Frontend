import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
