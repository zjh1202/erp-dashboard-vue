<template>
  <div class="app">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">看板页面一</h1>
      </div>
      <div class="header-right">
        <button class="header-btn">
          <span class="btn-icon">📊</span>
          <span>报表</span>
        </button>
        <button class="header-btn">
          <span class="btn-icon">⚙️</span>
          <span>设置</span>
        </button>
        <div class="header-time">{{ currentTime }}</div>
      </div>
    </header>
    
    <main class="app-main">
      <Dashboard />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Dashboard from '@/pages/Dashboard.vue'

const currentTime = ref('')
let timer: number

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  overflow: hidden;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 60px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  
  .header-left {
    .app-title {
      font-size: 20px;
      font-weight: 600;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 12px;
      
      &::before {
        content: '';
        width: 4px;
        height: 20px;
        background: linear-gradient(180deg, #3b82f6, #06b6d4);
        border-radius: 2px;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .header-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 8px;
      color: rgba(148, 163, 184, 0.9);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(59, 130, 246, 0.2);
        border-color: rgba(59, 130, 246, 0.4);
        color: #e2e8f0;
      }
      
      .btn-icon {
        font-size: 16px;
      }
    }
    
    .header-time {
      padding: 8px 16px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 8px;
      font-size: 14px;
      color: #3b82f6;
      font-family: 'Roboto Mono', monospace;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
  }
}

.app-main {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
</style>
