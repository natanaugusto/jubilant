import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  define: {
    API_URL: JSON.stringify(process.env.API_HOST) || "http://localhost:3000"
  },
  server: {
    host: process.env.WEB_HOST || "localhost",
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4000
  }
})
