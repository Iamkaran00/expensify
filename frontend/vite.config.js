import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  backend: {
    proxy: {
      '/api/v1': {
        target: 'https://expensify-6tgi.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
