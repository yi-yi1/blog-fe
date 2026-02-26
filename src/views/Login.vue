<template>
    <div class="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">站长通道</h1>
        <input
            v-model="password"
            type="password"
            @keyup.enter="handleLogin"
            placeholder="输入暗号..."
            class="w-full mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
        >
        <button
            @click="handleLogin"
            class="w-full bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"        >
            芝麻开门
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../store/auth';

const router = useRouter();
const password = ref('');

const handleLogin = async () => {
    if (login(password.value)) {
        router.push('/');
    } else {
        alert('密码错误，你不是站长 😡');
        password.value = '';
    }
}

</script>