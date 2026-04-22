<template>
  <div class="dashboard">
    <CNavBar />
    <div class="dashboard-content">
      <!-- 顶部能耗概览 -->
      <div class="top-cards">
        <div class="card-item" v-for="item in energyCards" :key="item.type" :class="item.type">
          <div class="card-icon">{{ item.icon }}</div>
          <div class="card-info">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-value">
              <span class="value">{{ item.value.toLocaleString() }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="card-trend" :class="item.trend >= 0 ? 'up' : 'down'">
              {{ item.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="main-layout">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <!-- 能耗分布 -->
          <div class="panel-item">
            <CPanel>
              <template #header>⚡ 能耗类型分布</template>
              <template #content>
                <CEcharts :option="energyPieOption" />
              </template>
            </CPanel>
          </div>
          <!-- 车间能耗排名 -->
          <div class="panel-item">
            <CPanel>
              <template #header>🏭 车间能耗排名</template>
              <template #content>
                <div class="workshop-ranking">
                  <div class="rank-item" v-for="(item, index) in workshopRanking" :key="index">
                    <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="rank-name">{{ item.name }}</span>
                    <div class="rank-bar">
                      <div class="rank-fill" :style="{ width: (item.value / maxConsumption * 100) + '%', background: item.color }"></div>
                    </div>
                    <span class="rank-value">{{ item.value.toLocaleString() }}kWh</span>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
        </div>

        <!-- 中间面板 -->
        <div class="center-panel">
          <div class="energy-main">
            <div class="main-title">实时能耗监控</div>
            <div class="realtime-display">
              <div class="realtime-item">
                <div class="realtime-icon">⚡</div>
                <div class="realtime-value">{{ realtimePower }}</div>
                <div class="realtime-label">实时功率 (kW)</div>
              </div>
            </div>
            <div class="power-curve">
              <CEcharts :option="powerCurveOption" />
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 能耗趋势 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📈 月度能耗趋势</template>
              <template #content>
                <CEcharts :option="monthlyTrendOption" />
              </template>
            </CPanel>
          </div>
          <!-- 能效指标 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📉 能效指标</template>
              <template #content>
                <div class="efficiency-list">
                  <div class="eff-item" v-for="(item, index) in efficiencyData" :key="index">
                    <span class="eff-name">{{ item.name }}</span>
                    <div class="eff-bar">
                      <div class="eff-fill" :style="{ width: item.value + '%', background: item.color }"></div>
                    </div>
                    <span class="eff-value">{{ item.value }}%</span>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
        </div>
      </div>

      <!-- 底部节能统计 -->
      <div class="bottom-bar">
        <div class="saving-item">
          <div class="saving-icon">🌱</div>
          <div class="saving-info">
            <div class="saving-value">{{ carbonReduction.toLocaleString() }}</div>
            <div class="saving-label">碳减排(kg)</div>
          </div>
        </div>
        <div class="saving-item">
          <div class="saving-icon">💰</div>
          <div class="saving-info">
            <div class="saving-value">{{ costSaving.toLocaleString() }}</div>
            <div class="saving-label">节约成本(元)</div>
          </div>
        </div>
        <div class="saving-item">
          <div class="saving-icon">📊</div>
          <div class="saving-info">
            <div class="saving-value">{{ unitConsumption }}</div>
            <div class="saving-label">单位产值能耗</div>
          </div>
        </div>
        <div class="saving-item">
          <div class="saving-icon">🎯</div>
          <div class="saving-info">
            <div class="saving-value">{{ targetRate }}%</div>
            <div class="saving-label">目标达成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CNavBar from '@/components/CNavBar.vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { energyConsumption } from '@/assets/data/manufacturing'

const energyCards = ref([
  { icon: '⚡', title: '今日用电', value: energyConsumption.electricity.value, unit: 'kWh', trend: energyConsumption.electricity.trend, type: 'electricity' },
  { icon: '🔥', title: '今日用气', value: energyConsumption.gas.value, unit: 'm³', trend: energyConsumption.gas.trend, type: 'gas' },
  { icon: '💧', title: '今日用水', value: energyConsumption.water.value, unit: 't', trend: energyConsumption.water.trend, type: 'water' },
  { icon: '📊', title: '综合能耗', value: 156800, unit: 'kWh', trend: 1.2, type: 'total' }
])

const realtimePower = ref(2850)
const carbonReduction = ref(12560)
const costSaving = ref(89500)
const unitConsumption = ref('0.042')
const targetRate = ref(96.5)

const workshopRanking = ref([
  { name: '涂装车间', value: 45600, color: '#ff4757' },
  { name: '焊接车间', value: 32800, color: '#ffa500' },
  { name: '冲压车间', value: 28500, color: '#5c7cfa' },
  { name: '总装车间', value: 19200, color: '#00d4aa' },
  { name: '检测车间', value: 8500, color: '#a0a0a0' }
])

const efficiencyData = ref([
  { name: '设备运行效率', value: 92, color: '#00d4aa' },
  { name: '能源利用率', value: 78, color: '#5c7cfa' },
  { name: '峰谷比优化', value: 85, color: '#ffa500' },
  { name: '余热回收率', value: 68, color: '#ff6b81' }
])

const maxConsumption = computed(() => Math.max(...workshopRanking.value.map(i => i.value)))

let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    realtimePower.value = Math.round(2500 + Math.random() * 800)
  }, 2000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// 实时功率曲线
const powerCurveOption = computed(() => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const data = Array.from({ length: 24 }, () => Math.round(2000 + Math.random() * 1500))
  
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20, 35, 65, 0.9)',
      borderColor: 'rgba(60, 120, 216, 0.5)',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.3)' } },
      axisLabel: { color: 'rgba(200, 220, 255, 0.6)', fontSize: 9 }
    },
    yAxis: {
      type: 'value',
      min: 1500,
      max: 4000,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.2)' } },
      axisLabel: { color: 'rgba(200, 220, 255, 0.6)' }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: data,
      lineStyle: { color: '#ffa500', width: 2 },
      itemStyle: { color: '#ffa500' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 165, 0, 0.3)' },
            { offset: 1, color: 'rgba(255, 165, 0, 0)' }
          ]
        }
      }
    }]
  }
})

// 能耗类型分布
const energyPieOption = computed(() => ({
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
    label: {
      formatter: '{b}\n{c}kWh ({d}%)',
      color: 'rgba(200, 220, 255, 0.8)',
      fontSize: 11
    },
    data: [
      { value: 125600, name: '电力', itemStyle: { color: '#ffa500' } },
      { value: 18500, name: '天然气', itemStyle: { color: '#5c7cfa' } },
      { value: 8500, name: '水', itemStyle: { color: '#00d4aa' } },
      { value: 4200, name: '其他', itemStyle: { color: '#a0a0a0' } }
    ]
  }]
}))

// 月度趋势
const monthlyTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  legend: {
    data: ['用电量', '用气量'],
    textStyle: { color: 'rgba(200, 220, 255, 0.8)', fontSize: 11 },
    top: 5
  },
  grid: {
    left: 45,
    right: 15,
    top: 35,
    bottom: 25
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    axisLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.3)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.6)', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.2)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.6)', fontSize: 10 }
  },
  series: [
    {
      name: '用电量',
      type: 'bar',
      data: [125000, 118000, 132000, 128000, 135000, 125600],
      itemStyle: { color: '#ffa500' },
      barWidth: '35%'
    },
    {
      name: '用气量',
      type: 'bar',
      data: [8200, 7800, 8500, 8300, 8800, 8500],
      itemStyle: { color: '#5c7cfa' },
      barWidth: '35%'
    }
  ]
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
  gap: 20px;
  padding: 10px 40px;
  
  .card-item {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 180px;
    
    &.electricity { border-color: rgba(255, 165, 0, 0.4); }
    &.gas { border-color: rgba(255, 71, 87, 0.4); }
    &.water { border-color: rgba(0, 212, 170, 0.4); }
    &.total { border-color: rgba(92, 124, 250, 0.4); }
    
    .card-icon {
      font-size: 28px;
    }
    
    .card-info {
      .card-title {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.7);
        margin-bottom: 4px;
      }
      
      .card-value {
        .value {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          font-family: 'UniDreamLED', sans-serif;
        }
        .unit {
          font-size: 12px;
          color: rgba(200, 220, 255, 0.6);
          margin-left: 4px;
        }
      }
      
      .card-trend {
        font-size: 11px;
        margin-top: 4px;
        &.up { color: #ff4757; }
        &.down { color: #00d4aa; }
      }
    }
  }
}

.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
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

.workshop-ranking {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .rank-item {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .rank-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
      
      &.rank-1 { background: #ff4757; color: #fff; }
      &.rank-2 { background: #ffa500; color: #fff; }
      &.rank-3 { background: #5c7cfa; color: #fff; }
      &.rank-4, &.rank-5 { background: rgba(200, 220, 255, 0.2); color: rgba(200, 220, 255, 0.8); }
    }
    
    .rank-name {
      width: 70px;
      font-size: 12px;
      color: rgba(200, 220, 255, 0.8);
    }
    
    .rank-bar {
      flex: 1;
      height: 8px;
      background: rgba(60, 120, 216, 0.2);
      border-radius: 4px;
      overflow: hidden;
      
      .rank-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }
    
    .rank-value {
      width: 80px;
      text-align: right;
      font-size: 12px;
      color: rgba(200, 220, 255, 0.8);
    }
  }
}

.efficiency-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .eff-item {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .eff-name {
      width: 80px;
      font-size: 12px;
      color: rgba(200, 220, 255, 0.7);
    }
    
    .eff-bar {
      flex: 1;
      height: 10px;
      background: rgba(60, 120, 216, 0.2);
      border-radius: 5px;
      overflow: hidden;
      
      .eff-fill {
        height: 100%;
        border-radius: 5px;
        transition: width 0.3s ease;
      }
    }
    
    .eff-value {
      width: 45px;
      text-align: right;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }
  }
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .energy-main {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 16px;
    padding: 24px;
    width: 100%;
    
    .main-title {
      text-align: center;
      font-size: 18px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 16px;
    }
    
    .realtime-display {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
      
      .realtime-item {
        text-align: center;
        
        .realtime-icon {
          font-size: 36px;
          margin-bottom: 8px;
        }
        
        .realtime-value {
          font-size: 48px;
          font-weight: bold;
          color: #ffa500;
          font-family: 'UniDreamLED', sans-serif;
        }
        
        .realtime-label {
          font-size: 13px;
          color: rgba(200, 220, 255, 0.6);
        }
      }
    }
    
    .power-curve {
      height: 180px;
    }
  }
}

.bottom-bar {
  display: flex;
  justify-content: center;
  gap: 70px;
  padding: 16px 40px;
  background: linear-gradient(180deg, rgba(20, 35, 65, 0.5), rgba(15, 25, 50, 0.6));
  border-top: 1px solid rgba(60, 120, 216, 0.2);
  
  .saving-item {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .saving-icon {
      font-size: 28px;
    }
    
    .saving-info {
      .saving-value {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        font-family: 'UniDreamLED', sans-serif;
      }
      
      .saving-label {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.6);
      }
    }
  }
}
</style>
