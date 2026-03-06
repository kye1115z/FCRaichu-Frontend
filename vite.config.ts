import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// TODO:  절대경로 설정하기

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      //
    ],
  },
});
