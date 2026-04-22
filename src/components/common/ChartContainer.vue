<template>
  <div class="chart-container">
    <div class="chart-header">
      <span class="chart-title">{{ title }}</span>
      <div class="chart-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="chart-content" :style="{ height: height + 'px' }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  height?: number
}

withDefaults(defineProps<Props>(), {
  height: 300
})
</script>

<style scoped lang="scss">
.chart-container {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 12px;
  overflow: hidden;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    
    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: linear-gradient(180deg, #3b82f6, #06b6d4);
        border-radius: 2px;
      }
    }
  }
  
  .chart-content {
    padding: 16px;
  }
}
</style>
