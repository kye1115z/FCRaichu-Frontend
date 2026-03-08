import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";

// MSW 활성화 함수 정의
async function enableMocking() {
  // 개발 환경에서만 MSW가 동작하도록 설정해줌.
  // vite 방식으로 현재 환경이 development인지 확인
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser.ts");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

// MSW가 준비도니 후에 앱 렌더링 시작하도록
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      {/* APP 대신 RouterProvider 넣어줘야 한다. */}
      <RouterProvider router={router} />
    </StrictMode>,
  );
});
