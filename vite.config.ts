import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

// GitHub Pages 项目页地址：https://<用户名>.github.io/<仓库名>/
// CI 里通过 VITE_BASE 注入真实仓库名（见 .github/workflows/deploy.yml），
// 因此仓库改名字也不会白屏；本地构建回退到这个默认值。
const DEFAULT_BASE = '/my-notes-blog/'

/**
 * GitHub Pages 是静态托管，history 模式下直接访问或刷新深层链接
 * （如 /my-notes-blog/notes/vue/xxx）会返回 404。
 * 这里把构建产物里的 index.html 复制一份为 404.html，
 * 浏览器地址栏不变，前端路由即可正常接管该路径。
 */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle() {
      const distDir = fileURLToPath(new URL('./dist', import.meta.url))
      copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 构建时使用仓库子路径，开发时使用根路径
  base: command === 'build' ? process.env.VITE_BASE || DEFAULT_BASE : '/',
  plugins: [vue(), spaFallback404()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // 监听 0.0.0.0，允许局域网内其他设备访问
    port: 5173,
  },
}))
