<template>
  <div class="max-w-[100%] px-4 sm:px-8 py-6 h-[calc(100vh-120px)] flex flex-col">
    
    <div class="flex justify-between items-center mb-6 shrink-0">
      <div class="flex-1 mr-6">
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="输入文章标题..." 
          class="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700"
        >
      </div>
      <button 
        @click="publishPost" 
        :disabled="isPublishing"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-blue-500/30 shrink-0"
      >
        {{ isPublishing ? '发布中...' : '发布文章' }}
      </button>
    </div>

    <div class="mb-4 shrink-0">
      <input 
        v-model="form.excerpt" 
        type="text" 
        placeholder="输入文章摘要（选填）..." 
        class="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent border-b border-gray-200 dark:border-gray-800 pb-2 outline-none focus:border-blue-500 transition-colors"
      >
    </div>
    <MarkdownEditor v-model="form.content" />   
  </div>
</template>

<script setup lang="ts">
import { ref,reactive} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MarkdownEditor from '../components/MarkdownEditor.vue';


const router = useRouter();

const form = reactive({
    title:'',
    excerpt:'',
    content:''
});

const isPublishing = ref(false);
//发布逻辑请求
const publishPost = async() =>{
    if (!form.title || !form.content) {
        alert('标题和内容不能为空哦！');
        return;
    }
    isPublishing.value = true;
    try {
        const response = await axios.post('https://blog-be-k6a0.onrender.com/posts', form);
        // 发布之后直接跳转到新发布的文章详情页
        router.push(`/post/${response.data.id}`);
    } catch (error){
        console.error('发布文章失败',error);
        alert('发布失败，请稍后再试！');
    } finally{
        isPublishing.value = false;
    }
}


</script>