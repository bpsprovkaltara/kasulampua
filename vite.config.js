import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.kasulampua.id',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://backend.kasulampua.id',
        changeOrigin: true,
        secure: true,
      },
      '/ckan-api': {
        target: 'https://data.kasulampua.id',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ckan-api/, '/api/3/action'),
      },
      '/ckan-file': {
        target: 'https://data.kasulampua.id',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ckan-file/, ''),
      }
    }
  }
})
