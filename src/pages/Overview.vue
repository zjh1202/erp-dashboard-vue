<template>
  <div class="dashboard">
    <CNavBar />
    <div class="dashboard-content">
      <!-- 顶部数据卡片 -->
      <div class="top-cards">
        <div class="card-item" v-for="item in topData" :key="item.title">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-value">
            <span class="value">{{ item.value }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
          <div class="card-trend" :class="item.trend >= 0 ? 'up' : 'down'">
            <span class="trend-icon">{{ item.trend >= 0 ? '↑' : '↓' }}</span>
            <span class="trend-value">{{ Math.abs(item.trend) }}%</span>
          </div>
        </div>
      </div>

      <!-- 中间布局 -->
      <div class="main-layout">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <!-- 产能利用率 -->
          <div class="panel-item">
            <CPanel>
              <template #header>🏭 产能利用率</template>
              <template #content>
                <div class="chart-wrapper">
                  <CEcharts :option="capacityOption" />
                </div>
              </template>
            </CPanel>
          </div>
          <!-- 产量排名 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📈 产品产量排名</template>
              <template #content>
                <vue3ScrollSeamless :dataList="outputRanking" :class-option="{ limitMoveNum: 5 }" class="scroll-list">
                  <div class="ranking-item" v-for="(item, index) in outputRanking" :key="index">
                    <span class="rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="label">{{ item.label }}</span>
                    <span class="value">{{ item.value.toLocaleString() }}</span>
                  </div>
                </vue3ScrollSeamless>
              </template>
            </CPanel>
          </div>
        </div>

        <!-- 中间面板 -->
        <div class="center-panel">
          <div class="center-card">
            <div class="center-title">今日生产概览</div>
            <div class="center-grid">
              <div class="grid-item">
                <div class="grid-value">{{ todayData.planned }}</div>
                <div class="grid-label">计划产量</div>
              </div>
              <div class="grid-item highlight">
                <div class="grid-value">{{ todayData.completed }}</div>
                <div class="grid-label">已完成</div>
              </div>
              <div class="grid-item">
                <div class="grid-value">{{ todayData.qualified }}%</div>
                <div class="grid-label">合格率</div>
              </div>
              <div class="grid-item">
                <div class="grid-value">{{ todayData.wip }}</div>
                <div class="grid-label">在制品</div>
              </div>
            </div>
          </div>
          <div class="center-chart">
            <CEcharts :option="trendOption" />
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- OEE展示 -->
          <div class="panel-item">
            <CPanel>
              <template #header>⚙️ 设备OEE</template>
              <template #content>
                <div class="oee-wrapper">
                  <div class="oee-main">
                    <div class="oee-circle">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="#1a2a4a" stroke-width="8" fill="none" />
                        <circle 
                          cx="50" cy="50" r="45" 
                          stroke="#00d4aa" 
                          stroke-width="8" 
                          fill="none"
                          :stroke-dasharray="`${oeeData.oee * 2.83} 283`"
                          stroke-linecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div class="oee-value">{{ oeeData.oee }}%</div>
                    </div>
                  </div>
                  <div class="oee-details">
                    <div class="oee-item">
                      <span class="label">可用率</span>
                      <span class="value">{{ oeeData.availability }}%</span>
                    </div>
                    <div class="oee-item">
                      <span class="label">表现率</span>
                      <span class="value">{{ oeeData.performance }}%</span>
                    </div>
                    <div class="oee-item">
                      <span class="label">质量率</span>
                      <span class="value">{{ oeeData.quality }}%</span>
                    </div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
          <!-- 设备状态 -->
          <div class="panel-item">
            <CPanel>
              <template #header>🔧 设备运行状态</template>
              <template #content>
                <div class="status-wrapper">
                  <div class="status-chart">
                    <CEcharts :option="statusOption" />
                  </div>
                  <div class="status-legend">
                    <div class="legend-item" v-for="item in equipmentStatus" :key="item.name">
                      <span class="dot" :style="{ background: item.color }"></span>
                      <span class="name">{{ item.name }}</span>
                      <span class="count">{{ item.value }}台</span>
                    </div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
        </div>
      </div>

      <!-- 底部数据 -->
      <div class="bottom-bar">
        <div class="bottom-item" v-for="item in bottomData" :key="item.label">
          <div class="bottom-label">{{ item.label }}</div>
          <div class="bottom-value">{{ item.value }}<span class="unit">{{ item.unit }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CNavBar from '@/components/CNavBar.vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { vue3ScrollSeamless } from 'vue3-scroll-seamless'
import { 
  capacityUtilization, 
  outputRanking, 
  monthlyCapacityTrend,
  equipmentStatus,
  oeeData,
  productionProgress
} from '@/assets/data/manufacturing'

const topData = ref([
  { title: '今日产量', value: '8,650', unit: '件', trend: 5.2 },
  { title: '产能利用率', value: '91.2', unit: '%', trend: 2.1 },
  { title: '设备OEE', value: '79.8', unit: '%', trend: 1.5 },
  { title: '合格率', value: '98.5', unit: '%', trend: 0.3 }
])

const bottomData = ref([
  { label: '今日计划', value: '10,000', unit: '件' },
  { label: '已完成', value: '8,650', unit: '件' },
  { label: '在制品', value: '1,350', unit: '件' },
  { label: '待发货', value: '2,800', unit: '件' },
  { label: '员工出勤', value: '98.5', unit: '%' }
])

const todayData = ref({
  planned: 10000,
  completed: 8650,
  qualified: 98.5,
  wip: 1350
})

// 产能利用率仪表盘
const capacityOption = computed(() => ({
  series: [{
    type: 'gauge',
    center: ['50%', '60%'],
    radius: '80%',
    startAngle: 200,
    endAngle: -20,
    min: 0,
    max: 100,
    splitNumber: 5,
    itemStyle: {
      color: '#00d4aa'
    },
    progress: {
      show: true,
      width: 12
    },
    pointer: {
      show: false
    },
    axisLine: {
      lineStyle: {
        width: 12,
        color: [[1, 'rgba(30, 60, 120, 0.3)']]
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    anchor: {
      show: false
    },
    title: {
      show: true,
      offsetCenter: [0, '10%'],
      fontSize: 12,
      color: 'rgba(200, 220, 255, 0.8)'
    },
    detail: {
      valueAnimation: true,
      fontSize: 28,
      offsetCenter: [0, '-10%'],
      formatter: '{value}%',
      color: '#00d4aa'
    },
    data: [{
      value: 91.2,
      name: '综合利用率'
    }]
  }]
}))

// 月度趋势图
const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  legend: {
    data: ['实际产能', '目标产能'],
    textStyle: { color: 'rgba(200, 220, 255, 0.8)' },
    top: 10
  },
  grid: {
    left: 50,
    right: 30,
    top: 50,
    bottom: 30
  },
  xAxis: {
    type: 'category',
    data: monthlyCapacityTrend.months,
    axisLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.3)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.7)' }
  },
  yAxis: {
    type: 'value',
    min: 70,
    max: 100,
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.2)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.7)' }
  },
  series: [
    {
      name: '实际产能',
      type: 'line',
      smooth: true,
      data: monthlyCapacityTrend.actual,
      lineStyle: { color: '#00d4aa', width: 2 },
      itemStyle: { color: '#00d4aa' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 212, 170, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 170, 0)' }
          ]
        }
      }
    },
    {
      name: '目标产能',
      type: 'line',
      smooth: true,
      data: monthlyCapacityTrend.target,
      lineStyle: { color: 'rgba(60, 120, 216, 0.6)', width: 2, type: 'dashed' },
      itemStyle: { color: 'rgba(60, 120, 216, 0.6)' }
    }
  ]
}))

// 设备状态饼图
const statusOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    label: {
      show: false
    },
    emphasis: {
      label: {
        show: false
      }
    },
    data: equipmentStatus.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    }))
  }]
}))
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a1628 0%, #0d1a2d 50%, #0f1f3a 100%);
  overflow: hidden;
  
  &-content {
    padding-top: 70px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.top-cards {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 10px 40px;
  
  .card-item {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 12px;
    padding: 16px 28px;
    min-width: 180px;
    text-align: center;
    
    .card-title {
      font-size: 13px;
      color: rgba(200, 220, 255, 0.7);
      margin-bottom: 8px;
    }
    
    .card-value {
      .value {
        font-size: 32px;
        font-weight: bold;
        color: #fff;
        font-family: 'UniDreamLED', sans-serif;
      }
      .unit {
        font-size: 14px;
        color: rgba(200, 220, 255, 0.6);
        margin-left: 4px;
      }
    }
    
    .card-trend {
      margin-top: 6px;
      font-size: 13px;
      &.up { color: #ff4757; }
      &.down { color: #00d4aa; }
    }
  }
}

.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
  padding: 10px 30px;
  min-height: 0;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .panel-item {
    flex: 1;
    min-height: 0;
  }
}

.scroll-list {
  height: 100%;
  max-height: 200px;
  overflow: hidden;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(60, 120, 216, 0.15);
  
  .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    
    &.rank-1 { background: linear-gradient(135deg, #ffd700, #ffaa00); color: #000; }
    &.rank-2 { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #000; }
    &.rank-3 { background: linear-gradient(135deg, #cd7f32, #a06020); color: #fff; }
    &.rank-4, &.rank-5 { background: rgba(60, 120, 216, 0.3); color: rgba(200, 220, 255, 0.8); }
  }
  
  .label {
    flex: 1;
    font-size: 14px;
    color: rgba(200, 220, 255, 0.9);
  }
  
  .value {
    font-size: 14px;
    color: #00d4aa;
    font-weight: 600;
  }
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .center-card {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 12px;
    padding: 20px;
    
    .center-title {
      text-align: center;
      font-size: 16px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 16px;
    }
    
    .center-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      
      .grid-item {
        text-align: center;
        padding: 12px;
        background: rgba(60, 120, 216, 0.1);
        border-radius: 8px;
        
        &.highlight {
          background: rgba(0, 212, 170, 0.15);
          border: 1px solid rgba(0, 212, 170, 0.3);
        }
        
        .grid-value {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          font-family: 'UniDreamLED', sans-serif;
        }
        
        .grid-label {
          font-size: 12px;
          color: rgba(200, 220, 255, 0.6);
          margin-top: 4px;
        }
      }
    }
  }
  
  .center-chart {
    flex: 1;
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.3), rgba(20, 35, 65, 0.2));
    border: 1px solid rgba(60, 120, 216, 0.2);
    border-radius: 12px;
    padding: 16px;
    min-height: 0;
  }
}

.oee-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
  
  .oee-main {
    .oee-circle {
      position: relative;
      width: 120px;
      height: 120px;
      
      svg {
        width: 100%;
        height: 100%;
      }
      
      .oee-value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 22px;
        font-weight: bold;
        color: #00d4aa;
      }
    }
  }
  
  .oee-details {
    flex: 1;
    
    .oee-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(60, 120, 216, 0.15);
      
      .label {
        color: rgba(200, 220, 255, 0.7);
        font-size: 13px;
      }
      
      .value {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.status-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  
  .status-chart {
    flex: 1;
    min-height: 0;
  }
  
  .status-legend {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      
      .name {
        flex: 1;
        font-size: 12px;
        color: rgba(200, 220, 255, 0.8);
      }
      
      .count {
        font-size: 12px;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.bottom-bar {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 16px 40px;
  background: linear-gradient(180deg, rgba(20, 35, 65, 0.5), rgba(15, 25, 50, 0.6));
  border-top: 1px solid rgba(60, 120, 216, 0.2);
  
  .bottom-item {
    text-align: center;
    
    .bottom-label {
      font-size: 12px;
      color: rgba(200, 220, 255, 0.6);
      margin-bottom: 4px;
    }
    
    .bottom-value {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      font-family: 'UniDreamLED', sans-serif;
      
      .unit {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.6);
        margin-left: 2px;
      }
    }
  }
}
</style>
