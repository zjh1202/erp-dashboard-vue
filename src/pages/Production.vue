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
          <div class="card-progress">
            <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="main-layout">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <!-- 车间产能 -->
          <div class="panel-item">
            <CPanel>
              <template #header>🏭 车间产能利用率</template>
              <template #content>
                <CEcharts :option="workshopOption" />
              </template>
            </CPanel>
          </div>
          <!-- 班组排名 -->
          <div class="panel-item">
            <CPanel>
              <template #header>👥 班组生产排名</template>
              <template #content>
                <div class="team-list">
                  <div class="team-item" v-for="(team, index) in teamRanking" :key="index">
                    <span class="team-rank">{{ index + 1 }}</span>
                    <span class="team-name">{{ team.team }}</span>
                    <div class="team-info">
                      <span class="output">{{ team.output }}件</span>
                      <span class="rate" :class="team.rate >= 99 ? 'high' : 'normal'">{{ team.rate }}%</span>
                    </div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
        </div>

        <!-- 中间面板 -->
        <div class="center-panel">
          <div class="center-main">
            <div class="main-title">生产进度实时监控</div>
            <div class="progress-circle">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" stroke="#1a2a4a" stroke-width="15" fill="none" />
                <circle 
                  cx="100" cy="100" r="85" 
                  stroke="#00d4aa" 
                  stroke-width="15" 
                  fill="none"
                  :stroke-dasharray="`${productionProgress.completed / productionProgress.planned * 534} 534`"
                  stroke-linecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div class="progress-text">
                <div class="progress-percent">{{ Math.round(productionProgress.completed / productionProgress.planned * 100) }}%</div>
                <div class="progress-label">完成率</div>
              </div>
            </div>
            <div class="progress-detail">
              <div class="detail-item">
                <span class="label">计划</span>
                <span class="value">{{ productionProgress.planned.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="label">已完成</span>
                <span class="value highlight">{{ productionProgress.completed.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="label">在制品</span>
                <span class="value">{{ productionProgress.wip.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 生产趋势 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📈 月度生产趋势</template>
              <template #content>
                <CEcharts :option="trendOption" />
              </template>
            </CPanel>
          </div>
          <!-- 产品分布 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📦 产品类型分布</template>
              <template #content>
                <CEcharts :option="productOption" />
              </template>
            </CPanel>
          </div>
        </div>
      </div>

      <!-- 底部生产节拍 -->
      <div class="bottom-bar">
        <div class="takt-item">
          <div class="takt-icon">⏱️</div>
          <div class="takt-info">
            <div class="takt-label">生产节拍</div>
            <div class="takt-value">{{ taktTime }} <span>秒/件</span></div>
          </div>
        </div>
        <div class="takt-item">
          <div class="takt-icon">🔄</div>
          <div class="takt-info">
            <div class="takt-label">日换模次数</div>
            <div class="takt-value">{{ changeoverCount }} <span>次</span></div>
          </div>
        </div>
        <div class="takt-item">
          <div class="takt-icon">📉</div>
          <div class="takt-info">
            <div class="takt-label">日产能</div>
            <div class="takt-value">{{ dailyCapacity.toLocaleString() }} <span>件</span></div>
          </div>
        </div>
        <div class="takt-item">
          <div class="takt-icon">📊</div>
          <div class="takt-info">
            <div class="takt-label">库存周转</div>
            <div class="takt-value">{{ inventoryTurnover }} <span>次</span></div>
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
import { capacityUtilization, teamRanking, monthlyCapacityTrend, productionProgress } from '@/assets/data/manufacturing'

const topData = ref([
  { title: '日产量', value: '8,650', unit: '件', progress: 86.5 },
  { title: '计划完成率', value: '86.5', unit: '%', progress: 86.5 },
  { title: '人均效率', value: '128', unit: '件/人', progress: 85 },
  { title: '交付准时率', value: '98.2', unit: '%', progress: 98.2 }
])

const taktTime = ref(45)
const changeoverCount = ref(3)
const dailyCapacity = ref(10000)
const inventoryTurnover = ref(8.5)

let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    productionProgress.completed = Math.min(productionProgress.completed + Math.floor(Math.random() * 10), productionProgress.planned)
  }, 3000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// 车间产能雷达图
const workshopOption = computed(() => ({
  radar: {
    indicator: capacityUtilization.map(item => ({
      name: item.name,
      max: 100
    })),
    shape: 'polygon',
    splitNumber: 4,
    axisName: {
      color: 'rgba(200, 220, 255, 0.7)',
      fontSize: 11
    },
    splitLine: {
      lineStyle: { color: 'rgba(60, 120, 216, 0.2)' }
    },
    splitArea: {
      areaStyle: { color: ['rgba(60, 120, 216, 0.05)', 'rgba(60, 120, 216, 0.1)'] }
    },
    axisLine: {
      lineStyle: { color: 'rgba(60, 120, 216, 0.3)' }
    }
  },
  series: [{
    type: 'radar',
    data: [{
      value: capacityUtilization.map(item => item.value),
      name: '产能利用率',
      areaStyle: {
        color: 'rgba(0, 212, 170, 0.3)'
      },
      lineStyle: { color: '#00d4aa', width: 2 },
      itemStyle: { color: '#00d4aa' }
    }]
  }]
}))

// 月度趋势
const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  grid: {
    left: 50,
    right: 20,
    top: 30,
    bottom: 30
  },
  xAxis: {
    type: 'category',
    data: monthlyCapacityTrend.months,
    axisLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.3)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.7)', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    min: 70,
    max: 100,
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.2)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.7)' }
  },
  series: [{
    type: 'bar',
    data: monthlyCapacityTrend.actual,
    barWidth: '50%',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#00d4aa' },
          { offset: 1, color: 'rgba(0, 212, 170, 0.3)' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    }
  }]
}))

// 产品分布
const productOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  series: [{
    type: 'pie',
    radius: ['35%', '60%'],
    center: ['50%', '50%'],
    label: {
      formatter: '{b}: {d}%',
      color: 'rgba(200, 220, 255, 0.8)',
      fontSize: 11
    },
    data: [
      { value: 35, name: 'A系列', itemStyle: { color: '#00d4aa' } },
      { value: 28, name: 'B系列', itemStyle: { color: '#5c7cfa' } },
      { value: 20, name: 'C系列', itemStyle: { color: '#ffa500' } },
      { value: 12, name: 'D系列', itemStyle: { color: '#ff6b81' } },
      { value: 5, name: '其他', itemStyle: { color: 'rgba(200, 220, 255, 0.4)' } }
    ]
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
    
    .card-progress {
      margin-top: 8px;
      height: 4px;
      background: rgba(60, 120, 216, 0.2);
      border-radius: 2px;
      overflow: hidden;
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #00d4aa, #5c7cfa);
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    }
  }
}

.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.team-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .team-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: rgba(60, 120, 216, 0.1);
    border-radius: 8px;
    border-left: 3px solid #00d4aa;
    
    .team-rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 212, 170, 0.2);
      color: #00d4aa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    .team-name {
      flex: 1;
      font-size: 14px;
      color: rgba(200, 220, 255, 0.9);
    }
    
    .team-info {
      display: flex;
      gap: 12px;
      
      .output {
        font-size: 13px;
        color: rgba(200, 220, 255, 0.7);
      }
      
      .rate {
        font-size: 13px;
        font-weight: 600;
        &.high { color: #00d4aa; }
        &.normal { color: #ffa500; }
      }
    }
  }
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .center-main {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 16px;
    padding: 30px;
    text-align: center;
    width: 100%;
    
    .main-title {
      font-size: 16px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 20px;
    }
    
    .progress-circle {
      position: relative;
      width: 180px;
      height: 180px;
      margin: 0 auto 20px;
      
      svg {
        width: 100%;
        height: 100%;
      }
      
      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        .progress-percent {
          font-size: 36px;
          font-weight: bold;
          color: #00d4aa;
          font-family: 'UniDreamLED', sans-serif;
        }
        
        .progress-label {
          font-size: 12px;
          color: rgba(200, 220, 255, 0.6);
        }
      }
    }
    
    .progress-detail {
      display: flex;
      justify-content: center;
      gap: 30px;
      
      .detail-item {
        .label {
          font-size: 12px;
          color: rgba(200, 220, 255, 0.6);
          display: block;
          margin-bottom: 4px;
        }
        
        .value {
          font-size: 18px;
          font-weight: bold;
          color: rgba(200, 220, 255, 0.9);
          
          &.highlight {
            color: #00d4aa;
          }
        }
      }
    }
  }
}

.bottom-bar {
  display: flex;
  justify-content: center;
  gap: 80px;
  padding: 20px 40px;
  background: linear-gradient(180deg, rgba(20, 35, 65, 0.5), rgba(15, 25, 50, 0.6));
  border-top: 1px solid rgba(60, 120, 216, 0.2);
  
  .takt-item {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .takt-icon {
      font-size: 28px;
    }
    
    .takt-info {
      .takt-label {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.6);
        margin-bottom: 2px;
      }
      
      .takt-value {
        font-size: 22px;
        font-weight: bold;
        color: #fff;
        font-family: 'UniDreamLED', sans-serif;
        
        span {
          font-size: 12px;
          color: rgba(200, 220, 255, 0.6);
          margin-left: 2px;
        }
      }
    }
  }
}
</style>
