<template>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 md:space-y-12"><article
        v-for="post in posts"
        :key="post.id"
        class="group cursor-pointer"
        @click="goToPost(post.id)"
        >
        <time class="text-xs md:text-sm text-gray-400 mb-1 md:mb-2 block font-mono">
            {{ post.createAt?.substring(0,10) }}
        </time>

        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors dark:text-gray-100">
            {{ post.title }}
        </h2>

        <p class="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-none">
            {{ post.excerpt }}
        </p>
        </article>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const posts = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get('https://blog-be-k6a0.onrender.com/posts');
    posts.value = response.data;
  } catch (error){
    console.error('获取文章列表失败',error);
  }
})


// 点击跳转到文章详情页
const goToPost = (id: number) => {
    router.push(`/post/${id}`);
}

</script>