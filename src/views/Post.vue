<template>
  <div class="w-full">
    
    <div class="w-full flex items-start">
    
      <aside 
        v-show="isSidebarOpen"
        class="hidden lg:flex flex-col w-[300px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-[#FAFAFA] dark:bg-[#111827] py-8 px-6 transition-all z-10"
      >
        <div class="flex items-center justify-between mb-8">
          <button @click="router.back()" class="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            返回列表
          </button>
          <button @click="isSidebarOpen = false" class="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-2" title="收起目录">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav>
          <ul class="space-y-3">
            <li v-for="heading in toc" :key="heading.id" :class="{'pl-4': heading.level === 3}">
              <a 
                :href="`#${heading.id}`" 
                class="block text-sm transition-colors"
                :class="activeId === heading.id 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'"
                @click.prevent="scrollTo(heading.id)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div v-show="!isSidebarOpen" class="hidden lg:flex sticky top-0 h-screen items-start py-8 px-4 border-r border-gray-200 dark:border-gray-800">
        <button @click="isSidebarOpen = true" class="text-gray-400 hover:text-blue-600 p-2" title="展开目录">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <main class="flex-1 min-w-0 w-full px-6 lg:px-24 xl:px-32 py-8 md:py-12">
        
        <button @click="router.back()" class="lg:hidden mb-6 text-sm text-gray-500 flex items-center">
          <span class="mr-2">←</span> 返回
        </button>

        <header class="mb-8 md:mb-12 flex justify-between items-start">
          <h1 class="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight">
            {{ post.title }}
          </h1>
          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
            <time>{{ post.createdAt?.substring(0,10) }}</time>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>前端技术</span>
          </div>
          <div v-if="isAdmin" class="flex space-x-3 shrink-0">
            <button 
              @click="router.push(`/edit/${post.id}`)"
              class="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-full transition-colors"
            >
              编辑
            </button>
            <button 
              @click="deletePost"
              class="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-full transition-colors"
            >
              删除
            </button>
          </div>
        </header>

        <article 
          ref="articleRef"
          class="prose md:prose-lg prose-slate dark:prose-invert max-w-none prose-pre:bg-gray-100 prose-pre:text-gray-800 dark:prose-pre:bg-[#1f2937] dark:prose-pre:text-gray-200"
          v-html="htmlContent"
        >
        </article>

        <div class="h-64 lg:hidden"></div>
      </main>

    </div>

    <div class="fixed bottom-8 right-6 z-40 lg:hidden transition-opacity duration-300" :class="isMobileTocOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'">
      <button 
        @click="isMobileTocOpen = true"
        class="bg-blue-600/90 backdrop-blur text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
    </div>

    <div 
      class="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none lg:hidden overflow-hidden"
    >
      <div 
        class="bg-white/95 dark:bg-[#1f2937]/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-[0_-5px_30px_rgba(0,0,0,0.15)] rounded-t-2xl max-h-[50vh] transition-transform duration-300 ease-out pointer-events-auto flex flex-col"
        :class="isMobileTocOpen ? 'translate-y-0' : 'translate-y-full'"
      >
        
        <div 
          @click="isMobileTocOpen = false"
          class="flex items-center justify-center py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 active:bg-gray-200"
        >
          <div class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-1"></div>
          <span class="sr-only">关闭目录</span>
        </div>

        <div class="overflow-y-auto p-6 pt-2">
          <ul class="space-y-4">
            <li 
              v-for="heading in toc" 
              :key="heading.id"
              :class="{'pl-4': heading.level === 3}"
            >
              <a 
                :href="`#${heading.id}`" 
                class="block text-sm transition-colors"
                :class="activeId === heading.id 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-gray-600 dark:text-gray-300'"
                @click.prevent="scrollTo(heading.id)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref,onMounted,onUnmounted,nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';
import axios from 'axios';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css'; // 引入代码高亮样式
import markdownItAnchor from 'markdown-it-anchor'

import markdownItKatex from '@iktakahiro/markdown-it-katex'
import 'katex/dist/katex.min.css'

import { isAdmin } from '../store/auth';

const route = useRoute();
const router = useRouter();
const articleRef = ref<HTMLElement | null>(null);
const isMobileTocOpen = ref(false) // 控制移动端目录开关
const isSidebarOpen = ref(true)    // 控制PC端侧边栏展开/折叠

// 初始化Markdown解析器
const md = new MarkdownIt({
    html: true, // 允许HTML标签
    breaks: true, // 换行转换为<br>
    linkify: true, // 自动将纯文本的 URL 转换为可点击的链接

    // 这个函数会在 markdown-it 遇到代码块（```...```）时被调用
    // str: 代码块里的具体代码文本
    // lang: 代码块标记的语言（例如 javascript, java, bash）
    highlight: function (str, lang){
        if (lang && hljs.getLanguage(lang)) {
            try {
                // 使用 highlight.js 对代码进行高亮处理
                // 它会返回带有 <span class="hljs-keyword"> 等标签的 HTML 字符串
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }
        // 如果没有指定语言或高亮失败，返回原始代码文本
        return '';
    }
});

md.use(markdownItAnchor,{
    level:[2,3], // 只提取h2和h3
    permalink:false
})
.use(markdownItKatex) // 支持数学公式 

const post = ref<any>({});

// 将 Markdown 内容渲染为 HTML
// 渲染为计算属性，当content有真实数据时，会自动触发md.render进行渲染
const htmlContent = computed(() => {
  if(!post.value.content) return '';
  return md.render(post.value.content);
})

interface TocItem {
  id: string;
  text: string;
  level: number;
}
const toc = ref<TocItem[]>([]);
const activeId = ref('') //记录当前正在阅读的章节id

const deletePost = async () => {
  if (!window.confirm('确定要永久删除吗？')) {
    return;
  }
  try {
    await axios.delete(`https://blog-be-k6a0.onrender.com/posts/${post.value.id}`);
    router.push('/'); // 删除成功后跳转到首页
  } catch (error) {
    console.error('删除文章失败', error);
    alert('删除失败，请稍后再试！');
  }
}

// 组件挂载(DOM渲染)完成后，抓取h2和h3
onMounted(async () => {
  // 根据路由参数中的id获取文章详情
    try {
      const reponse = await axios.get(`https://blog-be-k6a0.onrender.com/posts/${route.params.id}`);
      post.value = reponse.data;
    }catch (error){
      console.error('获取文章详情失败',error);
      
    }
    await nextTick() //确保v-html 的内容已经被浏览器真实渲染出来了
    if(articleRef.value){
      const headings = articleRef.value.querySelectorAll('h2, h3');
      toc.value = Array.from(headings).map((el) => {
        const h = el as HTMLElement;
        return {
          id: h.id,
          text: h.innerText,
          level: h.tagName === 'H2' ? 2 : 3
        }
      })
    }
    // 监听滚动事件，用于高亮当前目录
    window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})

// 平滑滚动到指定页面
const scrollTo = (id:string) => {
    const el = document.getElementById(id);
    if(el){
        // 减去顶部导航栏的高度，确保标题不会被遮挡
        const top = el.getBoundingClientRect().top + window.scrollY - 100; 
        window.scrollTo({
            top,
            behavior: 'smooth'
        })
    }
}
// 监听滚动，计算当前阅读到了哪个标题
const onScroll = () => {
    if(!articleRef.value) return;
    const headings = articleRef.value.querySelectorAll('h2, h3');
    let currentId = '';

    // 遍历所有标题，找到最后一个出现在屏幕上半部分的标题
    for(let i=0; i<headings.length; i++){
      const h = headings[i] as HTMLElement;
      const rect = h.getBoundingClientRect();
      if(rect.top <= 150) currentId = h.id || currentId;
    }
    // 如果当前没划到任何标题，则高亮第一个；否则高亮计算出来的那个
    activeId.value = currentId || toc.value[0]?.id || '';

}

</script>