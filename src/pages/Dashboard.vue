<template>
  <div class="dashboard-page">
    <!-- 左侧数据卡片 -->
    <div class="left-panel">
      <DataCard
        v-for="card in leftDataCards"
        :key="card.id"
        :title="card.title"
        :value="card.value"
        :unit="card.unit"
        :icon="card.icon"
        :color="card.color"
        :trend="card.trend"
      />
    </div>

    <!-- 中间主内容 -->
    <div class="main-content">
      <!-- 图表区域 -->
      <div class="charts-area">
        <ChartContainer title="生产趋势分析" :height="280">
          <ECharts :option="trendOption" />
        </ChartContainer>
        
        <div class="charts-row">
          <ChartContainer title="设备状态分布" :height="200">
            <ECharts :option="statusOption" />
          </ChartContainer>
          
          <ChartContainer title="工单进度" :height="200">
            <div class="workorder-list">
              <div 
                v-for="order in workOrderProgress" 
                :key="order.name"
                class="workorder-item"
              >
                <div class="order-info">
                  <span class="order-name">{{ order.name }}</span>
                  <span class="order-progress">{{ order.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: order.progress + '%' }"
                    :class="order.status"
                  ></div>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>

      <!-- 底部滚动栏 -->
      <BottomScroll :items="bottomScrollData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataCard from '@/components/cards/DataCard.vue'
import ChartContainer from '@/components/common/ChartContainer.vue'
import ECharts from '@/components/common/ECharts.vue'
import BottomScroll from '@/components/common/BottomScroll.vue'
import { 
  leftDataCards, 
  productionTrendData, 
  bottomScrollData,
  equipmentStatusData,
  workOrderProgress
} from '@/assets/data/dashboard'

// 生产趋势图配置
const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    textStyle: { color: '#e2e8f0' }
  },
  legend: {
    data: ['计划产量', '实际产量', '达成率'],
    textStyle: { color: 'rgba(148, 163, 184, 0.8)' },
    top: 0,
    right: 0
  },
  grid: {
    left: 50,
    right: 80,
    top: 40,
    bottom: 30
  },
  xAxis: {
    type: 'category',
    data: productionTrendData.map(d => d.time),
    axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.2)' } },
    axisLabel: { color: 'rgba(148, 163, 184, 0.7)' }
  },
  yAxis: [
    {
      type: 'value',
      name: '产量',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)' } },
      axisLabel: { color: 'rgba(148, 163, 184, 0.7)' }
    },
    {
      type: 'value',
      name: '达成率',
      max: 100,
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { color: 'rgba(148, 163, 184, 0.7)', formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '计划产量',
      type: 'line',
      data: productionTrendData.map(d => d.planned),
      lineStyle: { color: '#3b82f6', type: 'dashed' },
      itemStyle: { color: '#3b82f6' },
      symbol: 'none'
    },
    {
      name: '实际产量',
      type: 'line',
      data: productionTrendData.map(d => d.actual),
      lineStyle: { color: '#10b981', width: 2 },
      itemStyle: { color: '#10b981' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0)' }
          ]
        }
      }
    },
    {
      name: '达成率',
      type: 'line',
      yAxisIndex: 1,
      data: productionTrendData.map(d => d.efficiency),
      lineStyle: { color: '#f59e0b', width: 2 },
      itemStyle: { color: '#f59e0b' }
    }
  ]
}))

// 设备状态饼图
const statusOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    textStyle: { color: '#e2e8f0' }
  },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    label: {
      show: true,
      formatter: '{b}\n{c}台',
      color: 'rgba(148, 163, 184, 0.8)',
      fontSize: 11
    },
    labelLine: {
      lineStyle: { color: 'rgba(59, 130, 246, 0.3)' }
    },
    data: equipmentStatusData.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    }))
  }]
}))
</script>

<style scoped lang="scss">
.dashboard-page {
  display: flex;
  gap: 20px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.left-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.charts-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex-shrink: 0;
}

.workorder-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .workorder-item {
    .order-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .order-name {
        font-size: 13px;
        color: rgba(148, 163, 184, 0.9);
      }
      
      .order-progress {
        font-size: 13px;
        font-weight: 600;
        color: #3b82f6;
      }
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 4px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
        
        &.processing {
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
        }
        
        &.completed {
          background: linear-gradient(90deg, #10b981, #34d399);
        }
      }
    }
  }
}
</style>
