import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxies /api/* to the Express backend during `npm run dev` so the
    // frontend can just call fetch("/api/...") with no CORS config needed.
    // See server/README.md — run `npm run dev` there on port 4000 first.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
