import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  preview: {
    allowedHosts: ["cryptoex-production.up.railway.app"]
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern",
      },
    },
  },
});