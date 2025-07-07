import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: process.env.WEB_HOST || "localhost",
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4000
  }
});