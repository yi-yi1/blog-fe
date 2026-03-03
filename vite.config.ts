import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// 👇 引入图标和组件自动解析插件
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss(),
    
    // icon组件自动引入配置
    Components({
      resolvers: [
        // 配置图标解析器，只要看到 'i-' 开头的组件，就自动去图标库里找
        IconsResolver({
          prefix: 'i',
        }),
      ],
    }),

    //图标配置
    Icons({
      autoInstall: true, 
      defaultClass: 'inline-block align-middle text-current transition-colors', 
    })
  ],
})