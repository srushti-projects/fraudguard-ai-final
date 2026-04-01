import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Only proxy /api/* to FastAPI — do NOT proxy /community (that's a React route)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Proxy community API endpoints specifically (not the /community React page)
      '/community/posts': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/community/post': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/community/upvote': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
