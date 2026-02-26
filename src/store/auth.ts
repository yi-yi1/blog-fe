import { ref } from 'vue';
//尝试从浏览器的本地缓存中读取“暗号”
const savedToken = localStorage.getItem('blog_admin_token');

export const isAdmin = ref(savedToken==='root'); 

export const login = (password: string) => {
    if(password === 'root'){
        isAdmin.value = true;
        //将“暗号”保存到浏览器的本地缓存中，这样刷新页面后仍然保持登录状态
        localStorage.setItem('blog_admin_token',password);
        return true;
    }
    return false;
}

export const logout = () => {
    isAdmin.value = false;
    localStorage.removeItem('blog_admin_token');
}