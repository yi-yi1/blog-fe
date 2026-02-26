<template>
  <div class="min-h-screen flex flex-col">
    <header class="py-4 md:py-6 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div class="w-full px-6 md:px-10 h-16 flex justify-between items-center">
        <router-link to="/" class="text-lg md:text-xl font-bold tracking-wider text-gray-800 dark:text-gray-100 transition-colors">
          MY BLOG
        </router-link>
        
        <div class="flex items-center space-x-4 md:space-x-6">
          <nav class="space-x-4 md:space-x-6 text-sm md:text-base text-gray-500 dark:text-gray-400 flex items-center">
            <router-link to="/" class="hover:text-gray-900 dark:hover:text-white transition-colors">首页</router-link>
            <a href="#" class="hover:text-gray-900 dark:hover:text-white transition-colors">关于</a>

            <router-link v-if="isAdmin" to="/publish" class="text-blue-600 dark:text-blue-400 font-medium">
              ✎ 写文章
            </router-link>

            <button v-if="isAdmin" @click="logout" class="text-red-500 hover:text-red-700 ml-4">
              退出站长
            </button>

          </nav>
          
          <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

          <button @click="toggleDark" class="text-xl focus:outline-none" title="切换主题">
            {{ isDark ? '🌙' : '☀️' }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow w-full">
      <router-view />
    </main>

    <footer class="py-6 md:py-8 text-center text-xs md:text-sm text-gray-400 dark:text-gray-500">
      <p>© 2026 My Minimalist Blog. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
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