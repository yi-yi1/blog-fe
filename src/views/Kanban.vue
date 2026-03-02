<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 h-[calc(100vh-80px)] flex flex-col">
    <header class="mb-8 flex justify-between items-center shrink-0">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">任务看板 📌</h1>
      <p class="text-sm text-gray-500">拖拽卡片以改变任务进度</p>
    </header>

    <div class="flex-1 flex gap-6 overflow-x-auto pb-4 items-start min-h-0">
      
      <div 
        v-for="column in columns" 
        :key="column.status"
        class="flex-1 min-w-[300px] max-w-[400px] bg-gray-50 dark:bg-[#1f2937]/50 rounded-2xl p-4 flex flex-col max-h-full border border-gray-100 dark:border-gray-800"
        @dragover.prevent  
        @dragenter.prevent 
        @drop="onDrop($event, column.status)" 
      >
        <div class="flex justify-between items-center mb-4 shrink-0 px-1">
          <h2 class="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <span :class="column.color" class="w-3 h-3 rounded-full"></span>
            {{ column.name }}
            <span class="text-xs font-normal text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {{ column.tasks.length }}
            </span>
          </h2>
        </div>

        <div v-if="isAdmin && column.status === 'TODO'" class="mb-4 shrink-0">
          <input 
            v-model="newTaskTitle" 
            @keyup.enter="addTask"
            type="text" 
            placeholder="+ 输入新任务并回车..." 
            class="w-full text-sm px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-gray-200"
          >
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          <div 
            v-for="task in column.tasks" 
            :key="task.id"
            :draggable="isAdmin" 
            @dragstart="onDragStart($event, task)"
            class="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            :class="{'cursor-move': isAdmin, 'cursor-default': !isAdmin}"
          >
            <div class="flex justify-between items-start gap-2">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                {{ task.title }}
              </p>
              <button 
                v-if="isAdmin" 
                @click="deleteTask(task.id)"
                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity shrink-0 p-1"
                title="删除任务"
              >
                🗑️
              </button>
            </div>
            <div class="mt-3 text-[10px] text-gray-400 font-mono">
              {{ task.createdAt?.substring(0, 10) }}
            </div>
          </div>
          
          <div v-if="column.tasks.length === 0" class="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            暂无任务
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { isAdmin } from '../store/auth';

const tasks = ref<any[]>([]);
const newTaskTitle = ref('');

const columns = computed(() => [
  { name: '待办 (TODO)', status: 'TODO', color: 'bg-blue-400', tasks: tasks.value.filter(t => t.status === 'TODO') },
  { name: '进行中 (DOING)', status: 'DOING', color: 'bg-yellow-400', tasks: tasks.value.filter(t => t.status === 'DOING') },
  { name: '已完成 (DONE)', status: 'DONE', color: 'bg-green-400', tasks: tasks.value.filter(t => t.status === 'DONE') }
]);

// 获取任务列表
const fetchTasks = async () => {
  try {
    const response = await axios.get('/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error('获取任务失败:', error);
  }
};

onMounted(fetchTasks);

// 站长操作
const addTask = async () => {
  if (!newTaskTitle.value.trim() || !isAdmin.value) return;
  try {
    const response = await axios.post('/tasks', { 
      title: newTaskTitle.value
  });
    tasks.value.unshift(response.data);// 将新任务添加到列表顶部
    newTaskTitle.value = '';
  }catch (error) {
    console.error('添加任务失败:', error);
  };
}
const deleteTask = async (id: number) => {
  if (!isAdmin.value) return;
  try {
    await axios.delete(`/tasks/${id}`);
    tasks.value = tasks.value.filter(t => t.id !== id);
  } catch (error) {
    console.error('删除任务失败:', error);
  }
};
// 拖拽操作
const onDragStart = (event: DragEvent, task: any) => {
  if (!isAdmin.value) return;
  // 将拖拽任务的id存储在dataTransfer对象中
  event.dataTransfer?.setData('taskId', task.id.toString());
};

const onDrop = async (event: DragEvent, newStatus: string) => {
  if (!isAdmin.value) return;
  const taskIdStr = event.dataTransfer?.getData('taskId');
  if (!taskIdStr) return;
  const taskId = parseInt(taskIdStr);

  const task = tasks.value.find(t => t.id === taskId);
  if(task && task.status !== newStatus) {
    const oldStatus = task.status;
    task.status = newStatus; // 先更新状态以优化UI响应
    try {
      await axios.patch(`/tasks/${taskId}`, { status: newStatus });
    }catch (error) {
      console.error('更新任务状态失败:', error);
      task.status = oldStatus; // 恢复原状态
      alert('状态同步失败，请检查登录状态');
    }
  }
}

</script> 
<style scoped>
/* 隐藏滚动条但保留滚动功能，让面板看起来更干净 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>