<template>
  <div class="data-card" :style="{ '--card-color': color }">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">
        <span class="value">{{ formattedValue }}</span>
        <span class="unit">{{ unit }}</span>
      </div>
      <div v-if="trend !== undefined" class="card-trend" :class="{ up: trend >= 0, down: trend < 0 }">
        <span class="trend-icon">{{ trend >= 0 ? '↑' : '↓' }}</span>
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
  unit: string
  icon: string
  color: string
  trend?: number
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>

<style scoped lang="scss">
.data-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--card-color);
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: var(--card-color);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  .card-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }
  
  .card-content {
    flex: 1;
  }
  
  .card-title {
    font-size: 14px;
    color: rgba(148, 163, 184, 0.8);
    margin-bottom: 8px;
  }
  
  .card-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
    
    .value {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      font-family: 'Roboto Mono', monospace;
    }
    
    .unit {
      font-size: 14px;
      color: rgba(148, 163, 184, 0.6);
    }
  }
  
  .card-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    margin-top: 8px;
    
    &.up {
      color: #10b981;
    }
    
    &.down {
      color: #ef4444;
    }
    
    .trend-icon {
      font-size: 14px;
    }
  }
}
</style>
