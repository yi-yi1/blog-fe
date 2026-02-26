<template>
  <div class="flex-1 flex gap-6 min-h-0">
    
    <div class="flex-1 flex flex-col w-1/2 bg-gray-50 dark:bg-[#1f2937]/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
      
      <div class="flex items-center gap-1 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 text-sm overflow-x-auto select-none shrink-0">
        <button @click="insertAtCursor('**', '**')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold transition-colors" title="加粗">B</button>
        <button @click="insertAtCursor('*', '*')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded italic transition-colors" title="斜体">I</button>
        
        <div class="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button @click="insertAtCursor('## ', '')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold transition-colors" title="二级标题">H2</button>
        <button @click="insertAtCursor('### ', '')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold transition-colors" title="三级标题">H3</button>
        
        <div class="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button @click="insertAtCursor('- ', '')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="无序列表">• 列表</button>
        <button @click="insertAtCursor('> ', '')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="引用">❞ 引用</button>
        
        <div class="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button @click="insertAtCursor('[链接描述](', ')')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="插入链接">🔗</button>
        <button @click="insertAtCursor('![图片描述](', ')')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="插入图片">🖼️</button>
        <button @click="insertAtCursor('`', '`')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-mono transition-colors" title="行内代码">`code`</button>
        <button @click="insertAtCursor('\n```\n', '\n```\n')" class="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-mono transition-colors" title="代码块">&lt;/&gt;</button>
      </div>

      <textarea 
        ref="textareaRef"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder="开始创作你的文章... 支持 LaTeX 公式和代码块！"
        class="flex-1 w-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
      ></textarea>
    </div>

    <div class="flex-1 w-1/2 p-6 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-y-auto">
      <article 
        class="prose md:prose-lg prose-slate dark:prose-invert max-w-none prose-pre:bg-gray-50 prose-pre:text-gray-800 dark:prose-pre:bg-[#1f2937] dark:prose-pre:text-gray-200"
        v-html="previewHtml"
      >
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed,ref,nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import markdownItKatex from '@iktakahiro/markdown-it-katex';
import 'katex/dist/katex.min.css';

// 接收父组件传进来的值 (相当于接住 v-model)
const props = defineProps<{
  modelValue: string;
}>();

// 定义触发给父组件的事件 (相当于告诉 v-model 更新数据)
const emit = defineEmits(['update:modelValue']);

// 初始 Markdown 解析器 
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try { return hljs.highlight(str, { language: lang }).value; } catch (__) {}
    }
    return ''; 
  }
}).use(markdownItKatex);

// 监听传入的 modelValue 来实时渲染
const previewHtml = computed(() => {
  if (!props.modelValue) return '<p class="text-gray-400 dark:text-gray-600">预览区...</p>';
  return md.render(props.modelValue);
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const insertAtCursor = async (prefix: string, suffix: string = '')=>{
  if(!textareaRef.value) return;
  const textarea = textareaRef.value;
  // 获取光标的起始和结束位置
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentText = props.modelValue || '';
  const selectedText = textarea.value.substring(start, end);
  const newText = currentText.substring(0, start) + prefix + selectedText + suffix + currentText.substring(end);
  emit('update:modelValue', newText);

  await nextTick();
  //重新让输入框获得焦点
  textarea.focus();
  textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
}
</script>