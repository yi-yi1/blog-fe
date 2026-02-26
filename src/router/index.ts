import { createRouter, createWebHistory } from 'vue-router'
import { isAdmin } from '../store/auth'

// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'Home',
        // 懒加载
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/post/:id', // :id 是动态参数，代表文章的唯一标识
        name: 'Post',
        // 懒加载文章详情页组件
        component: () => import('../views/Post.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/publish',
        name: 'Publish',
        // 懒加载发布文章页组件
        component: () => import('../views/Publish.vue'),
        meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
        path: '/edit/:id',
        name: 'Edit',
        component: () => import('../views/Edit.vue'),
        meta: { requiresAuth: true } // 需要登录才能访问
    }
]

const router = createRouter({
    // 使用html5的历史记录模式，这样URL中就不会有#号
    history: createWebHistory(),
    routes
})

// 全局前置路由：在每次路由切换之前都会执行这个函数 
router.beforeEach((to,from,next) => {
    // 如果目标路由需要认证，但用户没有登录，则重定向到登录页
    if(to.meta.requiresAuth && !isAdmin.value){
        next('/login');
    } else {
        next();
    }
})

export default router