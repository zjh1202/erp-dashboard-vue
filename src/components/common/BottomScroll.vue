<template>
  <div class="bottom-scroll">
    <div class="scroll-header">
      <span class="header-title">设备运行状态监控</span>
      <div class="header-status">
        <span class="status-dot running"></span> 正常
        <span class="status-dot warning"></span> 警告
        <span class="status-dot error"></span> 故障
      </div>
    </div>
    <div class="scroll-content">
      <vue3-seamless-scroll :data-list="items" :class-option="scrollOption">
        <div class="scroll-item" v-for="item in items" :key="item.id">
          <div class="item-equipment">{{ item.equipment }}</div>
          <div class="item-status" :class="getStatusClass(item.status)">
            {{ item.status }}
          </div>
          <div class="item-value">{{ item.value }}</div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import type { BottomScrollItem } from '@/types'

interface Props {
  items: BottomScrollItem[]
}

const props = defineProps<Props>()

const scrollOption = computed(() => ({
  step: 0.5,
  limitMoveNum: 5,
  hoverStop: true,
  direction: 2,
  singleHeight: 0,
  waitTime: 1000
}))

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    '正常运行': 'running',
    '维护中': 'warning',
    '警告': 'warning',
    '故障': 'error',
    '待机': 'idle'
  }
  return map[status] || 'idle'
}
</script>

<style scoped lang="scss">
.bottom-scroll {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  height: 120px;
  display: flex;
  flex-direction: column;
  
  .scroll-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    
    .header-title {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &::before {
        content: '▶';
        color: #3b82f6;
        font-size: 10px;
      }
    }
    
    .header-status {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: rgba(148, 163, 184, 0.8);
      
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 4px;
        
        &.running { background: #10b981; }
        &.warning { background: #f59e0b; }
        &.error { background: #ef4444; }
      }
    }
  }
  
  .scroll-content {
    flex: 1;
    overflow: hidden;
    padding: 0 24px;
  }
  
  .scroll-item {
    display: inline-flex;
    align-items: center;
    gap: 24px;
    padding: 12px 20px;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 8px;
    margin-right: 16px;
    min-width: 240px;
    border: 1px solid rgba(59, 130, 246, 0.1);
    
    .item-equipment {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
      min-width: 80px;
    }
    
    .item-status {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.running {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }
      
      &.warning {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }
      
      &.error {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
      }
      
      &.idle {
        background: rgba(107, 114, 128, 0.2);
        color: #9ca3af;
      }
    }
    
    .item-value {
      font-size: 14px;
      color: #3b82f6;
      font-weight: 600;
      font-family: 'Roboto Mono', monospace;
    }
    
    .item-time {
      font-size: 12px;
      color: rgba(148, 163, 184, 0.6);
    }
  }
}
</style>
