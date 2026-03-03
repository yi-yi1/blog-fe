<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-[#0b1120] transition-colors duration-300">
    
    <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.1),rgba(0,0,0,0.5))] opacity-20 dark:opacity-10"></div>
      
      <div class="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-soft-light animate-blob"></div>
      <div class="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-purple-400/30 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-2000"></div>
    </div>

    <header class="py-4 md:py-6 border-b border-gray-100 dark:border-gray-800 transition-colors relative z-10">
      <div class="w-full px-6 md:px-10 h-16 flex justify-between items-center">
        <router-link to="/" class="text-lg md:text-xl font-bold tracking-wider text-gray-800 dark:text-gray-100 transition-colors">
          MY BLOG
        </router-link>
        
        <div class="flex items-center space-x-4 md:space-x-6">
          <nav class="flex items-center gap-4 md:gap-6 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
          
          <router-link 
            to="/" 
            exact-active-class="text-blue-600 dark:text-blue-400"
            class="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <i-heroicons-home-solid class="text-lg" />
            <span class="hidden md:inline">首页</span>
          </router-link>
          
          <router-link 
            to="/kanban" 
            active-class="text-blue-600 dark:text-blue-400"
            class="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <i-fluent-board-24-filled class="text-lg" />
            <span class="hidden md:inline">看板</span>
          </router-link>

          <router-link 
            v-if="isAdmin" 
            to="/publish" 
            active-class="text-blue-600 dark:text-blue-400"
            class="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <i-heroicons-pencil-square-solid class="text-lg" />
            <span class="hidden md:inline">写文章</span>
          </router-link>

          <button v-if="isAdmin" @click="logout" class="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 ml-2">
            <i-heroicons-arrow-right-on-rectangle-solid class="text-lg" />
            <span class="hidden md:inline">退出</span>
          </button>
        </nav>
          
          <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

          <button @click="toggleDark" class="text-xl focus:outline-none" title="切换主题">
            {{ isDark ? '🌙' : '☀️' }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow w-full relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="py-6 md:py-8 text-center text-xs md:text-sm text-gray-400 dark:text-gray-500 relative z-10">
      <p>© 2026 My Minimalist Blog. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 完全保留你原有的逻辑
import { ref, onMounted } from 'vue';
import { isAdmin, logout } from './store/auth';

const isDark = ref(false);
// 切换主题
const toggleDark = () => {
  isDark.value = !isDark.value;
  // 获取HTML标签
  const htmlEl = document.documentElement;

  if(isDark.value) {
    htmlEl.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    htmlEl.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// 组件挂载时检查用户之前的主题选择
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
}) 
</script>

<style>
/* --- 页面路由切换的丝滑动画 --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- 背景氛围光晕的漂浮呼吸动画 --- */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>