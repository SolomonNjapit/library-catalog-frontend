import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api/borrow-requests": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api/bookings": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
