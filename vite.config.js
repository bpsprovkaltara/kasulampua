import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ckanProxyTarget =
    env.DEV_CKAN_PROXY_TARGET?.trim() || 'https://data.kasulampua.id'

  /** Same-origin paths in the browser; Vite proxies to CKAN (hindari CORS). */
  const ckanDevProxy = {
    '/ckan-api': {
      target: ckanProxyTarget,
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/ckan-api/, '/api/3/action'),
    },
    '/ckan-file': {
      target: ckanProxyTarget,
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/ckan-file/, ''),
    },
  }

  return {
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
          target: 'https://apikasulampua.datakaltara.my.id',
          changeOrigin: true,
          secure: true,
        },
        '/uploads': {
          target: 'https://apikasulampua.datakaltara.my.id',
          changeOrigin: true,
          secure: true,
        },
        ...ckanDevProxy,
      },
    },
    preview: {
      proxy: {
        ...ckanDevProxy,
      },
    },
  }
})
