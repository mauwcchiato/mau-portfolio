import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  /* public/assets already holds the images and videos; keep the bundle apart */
  build: { assetsDir: "static", chunkSizeWarningLimit: 1400 }
});
