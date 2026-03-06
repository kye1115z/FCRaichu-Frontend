import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* APP 대신 RouterProvider 넣어줘야 한다. */}
    <RouterProvider router={router} />
  </StrictMode>,
);
