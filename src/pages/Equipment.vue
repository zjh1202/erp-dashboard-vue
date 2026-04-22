<template>
  <div class="dashboard">
    <CNavBar />
    <div class="dashboard-content">
      <!-- 顶部设备指标 -->
      <div class="top-cards">
        <div class="card-item" v-for="item in equipmentCards" :key="item.title" :class="item.type">
          <div class="card-icon">{{ item.icon }}</div>
          <div class="card-info">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-value">
              <span class="value">{{ item.value }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="main-layout">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <!-- 设备状态分布 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📊 设备状态分布</template>
              <template #content>
                <div class="status-overview">
                  <div class="status-chart">
                    <CEcharts :option="statusPieOption" />
                  </div>
                  <div class="status-summary">
                    <div class="summary-item" v-for="item in statusSummary" :key="item.name">
                      <span class="dot" :style="{ background: item.color }"></span>
                      <span class="name">{{ item.name }}</span>
                      <span class="count">{{ item.count }}</span>
                      <span class="percent">{{ item.percent }}%</span>
                    </div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
          <!-- 故障记录 -->
          <div class="panel-item">
            <CPanel>
              <template #header>⚠️ 今日故障记录</template>
              <template #content>
                <div class="fault-list">
                  <div class="fault-item" v-for="(fault, index) in faultRecords" :key="index">
                    <div class="fault-info">
                      <span class="fault-id">{{ fault.id }}</span>
                      <span class="fault-level" :class="fault.level">{{ fault.levelText }}</span>
                    </div>
                    <div class="fault-content">{{ fault.content }}</div>
                    <div class="fault-time">{{ fault.time }}</div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
        </div>

        <!-- 中间面板 -->
        <div class="center-panel">
          <div class="oee-main">
            <div class="main-title">OEE 设备综合效率</div>
            <div class="oee-display">
              <div class="oee-circle large">
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" stroke="#1a2a4a" stroke-width="16" fill="none" />
                  <circle 
                    cx="100" cy="100" r="85" 
                    stroke="#00d4aa" 
                    stroke-width="16" 
                    fill="none"
                    :stroke-dasharray="`${oeeData.oee * 5.34} 534`"
                    stroke-linecap="round"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div class="oee-center">
                  <div class="oee-value">{{ oeeData.oee }}%</div>
                  <div class="oee-label">综合效率</div>
                </div>
              </div>
            </div>
            <div class="oee-breakdown">
              <div class="oee-part">
                <div class="part-header">
                  <span class="part-name">可用率</span>
                  <span class="part-value">{{ oeeData.availability }}%</span>
                </div>
                <div class="part-bar">
                  <div class="part-fill" :style="{ width: oeeData.availability + '%', background: '#00d4aa' }"></div>
                </div>
              </div>
              <div class="oee-part">
                <div class="part-header">
                  <span class="part-name">表现率</span>
                  <span class="part-value">{{ oeeData.performance }}%</span>
                </div>
                <div class="part-bar">
                  <div class="part-fill" :style="{ width: oeeData.performance + '%', background: '#5c7cfa' }"></div>
                </div>
              </div>
              <div class="oee-part">
                <div class="part-header">
                  <span class="part-name">质量率</span>
                  <span class="part-value">{{ oeeData.quality }}%</span>
                </div>
                <div class="part-bar">
                  <div class="part-fill" :style="{ width: oeeData.quality + '%', background: '#ffa500' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 维保计划 -->
          <div class="panel-item">
            <CPanel>
              <template #header>🔧 维保计划</template>
              <template #content>
                <div class="maintenance-list">
                  <div class="maintenance-item" v-for="(item, index) in maintenancePlan" :key="index">
                    <div class="maint-type" :class="item.type">{{ item.typeText }}</div>
                    <div class="maint-content">{{ item.content }}</div>
                    <div class="maint-date">{{ item.date }}</div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
          <!-- 设备健康度 -->
          <div class="panel-item">
            <CPanel>
              <template #header>💚 设备健康度</template>
              <template #content>
                <CEcharts :option="healthOption" />
              </template>
            </CPanel>
          </div>
        </div>
      </div>

      <!-- 底部维护统计 -->
      <div class="bottom-bar">
        <div class="maint-stat">
          <div class="stat-icon">🛠️</div>
          <div class="stat-info">
            <div class="stat-value">{{ maintenanceStats.today }}</div>
            <div class="stat-label">今日保养</div>
          </div>
        </div>
        <div class="maint-stat">
          <div class="stat-icon">⏰</div>
          <div class="stat-info">
            <div class="stat-value">{{ maintenanceStats.pending }}</div>
            <div class="stat-label">待保养</div>
          </div>
        </div>
        <div class="maint-stat">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-value">{{ maintenanceStats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
        <div class="maint-stat">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ maintenanceStats.thisMonth }}</div>
            <div class="stat-label">本月计划</div>
          </div>
        </div>
        <div class="maint-stat">
          <div class="stat-icon">🔋</div>
          <div class="stat-info">
            <div class="stat-value">{{ mtbf }}</div>
            <div class="stat-label">MTBF(小时)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CNavBar from '@/components/CNavBar.vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { equipmentStatus, oeeData } from '@/assets/data/manufacturing'

const equipmentCards = ref([
  { icon: '🏭', title: '设备总数', value: '179', unit: '台', type: 'normal' },
  { icon: '✅', title: '正常运行', value: '156', unit: '台', type: 'good' },
  { icon: '🔧', title: '维护中', value: '12', unit: '台', type: 'warning' },
  { icon: '❌', title: '故障停机', value: '3', unit: '台', type: 'danger' }
])

const statusSummary = ref([
  { name: '正常运行', count: 156, percent: 87, color: '#00d4aa' },
  { name: '维护中', count: 12, percent: 7, color: '#ffa500' },
  { name: '故障停机', count: 3, percent: 2, color: '#ff4757' },
  { name: '待产能', count: 8, percent: 4, color: '#5c7cfa' }
])

const faultRecords = ref([
  { id: 'F-001', level: 'minor', levelText: '轻微', content: 'A线CNC-03异常报警', time: '10:25' },
  { id: 'F-002', level: 'major', levelText: '重大', content: 'B线焊接机器人故障', time: '09:15' },
  { id: 'F-003', level: 'minor', levelText: '轻微', content: 'C线传送带异响', time: '08:40' }
])

const maintenancePlan = ref([
  { type: 'daily', typeText: '日常', content: '冲压车间设备点检', date: '今天 14:00' },
  { type: 'weekly', typeText: '周常', content: '涂装线过滤器更换', date: '明天 09:00' },
  { type: 'monthly', typeText: '月度', content: '全体设备精度校准', date: '01-25 08:00' }
])

const maintenanceStats = ref({
  today: 5,
  pending: 3,
  completed: 2,
  thisMonth: 28
})

const mtbf = ref(856)

// 设备状态饼图
const statusPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  series: [{
    type: 'pie',
    radius: ['50%', '75%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: {
      label: { show: false }
    },
    data: equipmentStatus.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    }))
  }]
}))

// 健康度仪表盘
const healthOption = computed(() => ({
  series: [{
    type: 'gauge',
    center: ['50%', '60%'],
    radius: '85%',
    startAngle: 200,
    endAngle: -20,
    min: 0,
    max: 100,
    splitNumber: 5,
    itemStyle: { color: '#00d4aa' },
    progress: { show: true, width: 12 },
    pointer: { show: false },
    axisLine: {
      lineStyle: { width: 12, color: [[1, 'rgba(30, 60, 120, 0.3)']] }
    },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    anchor: { show: false },
    title: {
      show: true,
      offsetCenter: [0, '10%'],
      fontSize: 12,
      color: 'rgba(200, 220, 255, 0.8)'
    },
    detail: {
      valueAnimation: true,
      fontSize: 24,
      offsetCenter: [0, '-10%'],
      formatter: '{value}%',
      color: '#00d4aa'
    },
    data: [{ value: 92, name: '综合健康度' }]
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
    min-width: 160px;
    
    &.good { border-color: rgba(0, 212, 170, 0.4); }
    &.warning { border-color: rgba(255, 165, 0, 0.4); }
    &.danger { border-color: rgba(255, 71, 87, 0.4); }
    
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
          font-size: 26px;
          font-weight: bold;
          color: #fff;
          font-family: 'UniDreamLED', sans-serif;
        }
        .unit {
          font-size: 12px;
          color: rgba(200, 220, 255, 0.6);
          margin-left: 2px;
        }
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

.status-overview {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  
  .status-chart {
    flex: 1;
    min-height: 0;
  }
  
  .status-summary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    
    .summary-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: rgba(60, 120, 216, 0.1);
      border-radius: 6px;
      
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      
      .name {
        flex: 1;
        font-size: 11px;
        color: rgba(200, 220, 255, 0.7);
      }
      
      .count {
        font-size: 12px;
        font-weight: 600;
        color: #fff;
      }
      
      .percent {
        font-size: 11px;
        color: rgba(200, 220, 255, 0.5);
      }
    }
  }
}

.fault-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .fault-item {
    padding: 10px 12px;
    background: rgba(255, 71, 87, 0.1);
    border-radius: 8px;
    border-left: 3px solid #ff4757;
    
    .fault-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      
      .fault-id {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.6);
      }
      
      .fault-level {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        
        &.minor { background: rgba(255, 165, 0, 0.2); color: #ffa500; }
        &.major { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
      }
    }
    
    .fault-content {
      font-size: 13px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 4px;
    }
    
    .fault-time {
      font-size: 11px;
      color: rgba(200, 220, 255, 0.5);
    }
  }
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .maintenance-item {
    padding: 10px 12px;
    background: rgba(60, 120, 216, 0.1);
    border-radius: 8px;
    
    .maint-type {
      display: inline-block;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
      
      &.daily { background: rgba(0, 212, 170, 0.2); color: #00d4aa; }
      &.weekly { background: rgba(92, 124, 250, 0.2); color: #5c7cfa; }
      &.monthly { background: rgba(255, 165, 0, 0.2); color: #ffa500; }
    }
    
    .maint-content {
      font-size: 13px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 4px;
    }
    
    .maint-date {
      font-size: 11px;
      color: rgba(200, 220, 255, 0.5);
    }
  }
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .oee-main {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 16px;
    padding: 30px;
    width: 100%;
    
    .main-title {
      text-align: center;
      font-size: 18px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 20px;
    }
    
    .oee-display {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
      
      .oee-circle {
        position: relative;
        width: 180px;
        height: 180px;
        
        &.large {
          width: 180px;
          height: 180px;
        }
        
        svg {
          width: 100%;
          height: 100%;
        }
        
        .oee-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          
          .oee-value {
            font-size: 36px;
            font-weight: bold;
            color: #00d4aa;
            font-family: 'UniDreamLED', sans-serif;
          }
          
          .oee-label {
            font-size: 12px;
            color: rgba(200, 220, 255, 0.6);
          }
        }
      }
    }
    
    .oee-breakdown {
      display: flex;
      flex-direction: column;
      gap: 14px;
      
      .oee-part {
        .part-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          
          .part-name {
            font-size: 12px;
            color: rgba(200, 220, 255, 0.7);
          }
          
          .part-value {
            font-size: 13px;
            font-weight: 600;
            color: #fff;
          }
        }
        
        .part-bar {
          height: 6px;
          background: rgba(60, 120, 216, 0.2);
          border-radius: 3px;
          overflow: hidden;
          
          .part-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
          }
        }
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
  
  .maint-stat {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .stat-icon {
      font-size: 28px;
    }
    
    .stat-info {
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        font-family: 'UniDreamLED', sans-serif;
      }
      
      .stat-label {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.6);
      }
    }
  }
}
</style>
