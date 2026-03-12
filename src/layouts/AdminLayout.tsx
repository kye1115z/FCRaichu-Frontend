import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

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
