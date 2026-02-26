import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 配置axios全局请求拦截器
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('blog_admin_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

const app = createApp(App)
app.use(router)
app.mount('#app')
