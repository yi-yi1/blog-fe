import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),
    Icons({
      autoInstall: true, 
      defaultClass: 'inline-block align-middle text-current transition-colors', 
    })
  ],
  // 启用 Tailwind CSS 插件
})
