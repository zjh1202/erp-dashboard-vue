<template>
  <div class="dashboard">
    <CNavBar />
    <div class="dashboard-content">
      <!-- 顶部质量指标 -->
      <div class="top-cards">
        <div class="card-item highlight" v-for="item in qualityCards" :key="item.title">
          <div class="card-icon">{{ item.icon }}</div>
          <div class="card-info">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-value">
              <span class="value">{{ item.value }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
          <div class="card-status" :class="item.status">
            {{ item.status === 'good' ? '✓ 达标' : '⚠ 关注' }}
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="main-layout">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <!-- 不良品分布 -->
          <div class="panel-item">
            <CPanel>
              <template #header>⚠️ 不良品分布</template>
              <template #content>
                <CEcharts :option="defectOption" />
              </template>
            </CPanel>
          </div>
          <!-- 质量趋势 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📈 质量合格率趋势</template>
              <template #content>
                <CEcharts :option="qualityTrendOption" />
              </template>
            </CPanel>
          </div>
        </div>

        <!-- 中间面板 -->
        <div class="center-panel">
          <div class="quality-main">
            <div class="main-title">质量监控中心</div>
            <div class="quality-gauges">
              <div class="gauge-item">
                <div class="gauge-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1a2a4a" stroke-width="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      :stroke="qualityGaugeData.iqc >= 99 ? '#00d4aa' : '#ffa500'" 
                      stroke-width="8" 
                      fill="none"
                      :stroke-dasharray="`${qualityGaugeData.iqc * 2.51} 251`"
                      stroke-linecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div class="gauge-value">{{ qualityGaugeData.iqc }}%</div>
                </div>
                <div class="gauge-label">来料检验</div>
              </div>
              <div class="gauge-item">
                <div class="gauge-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1a2a4a" stroke-width="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      :stroke="qualityGaugeData.pqc >= 98 ? '#00d4aa' : '#ffa500'" 
                      stroke-width="8" 
                      fill="none"
                      :stroke-dasharray="`${qualityGaugeData.pqc * 2.51} 251`"
                      stroke-linecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div class="gauge-value">{{ qualityGaugeData.pqc }}%</div>
                </div>
                <div class="gauge-label">过程检验</div>
              </div>
              <div class="gauge-item">
                <div class="gauge-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1a2a4a" stroke-width="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      :stroke="qualityGaugeData.fqc >= 99 ? '#00d4aa' : '#ffa500'" 
                      stroke-width="8" 
                      fill="none"
                      :stroke-dasharray="`${qualityGaugeData.fqc * 2.51} 251`"
                      stroke-linecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div class="gauge-value">{{ qualityGaugeData.fqc }}%</div>
                </div>
                <div class="gauge-label">成品检验</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 不良TOP5 -->
          <div class="panel-item">
            <CPanel>
              <template #header>🔍 不良项目TOP5</template>
              <template #content>
                <div class="defect-list">
                  <div class="defect-item" v-for="(item, index) in defectTop5" :key="index">
                    <span class="defect-rank">{{ index + 1 }}</span>
                    <span class="defect-name">{{ item.name }}</span>
                    <span class="defect-count">{{ item.count }}件</span>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
          <!-- 客诉追踪 -->
          <div class="panel-item">
            <CPanel>
              <template #header>📋 客诉追踪</template>
              <template #content>
                <div class="complaint-list">
                  <div class="complaint-item" v-for="(item, index) in complaints" :key="index">
                    <div class="complaint-header">
                      <span class="complaint-id">{{ item.id }}</span>
                      <span class="complaint-status" :class="item.status">{{ item.statusText }}</span>
                    </div>
                    <div class="complaint-content">{{ item.content }}</div>
                    <div class="complaint-date">{{ item.date }}</div>
                  </div>
                </div>
              </template>
            </CPanel>
          </div>
        </div>
      </div>

      <!-- 底部统计数据 -->
      <div class="bottom-bar">
        <div class="stat-item">
          <div class="stat-value">{{ totalInspect }}</div>
          <div class="stat-label">检验总数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ qualifiedCount }}</div>
          <div class="stat-label">合格数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value warning">{{ defectCount }}</div>
          <div class="stat-label">不良数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ rejectRate }}</div>
          <div class="stat-label">退料率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ customerSatisfaction }}%</div>
          <div class="stat-label">客户满意度</div>
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
import { defectDistribution, qualityMetrics } from '@/assets/data/manufacturing'

const qualityCards = ref([
  { icon: '🔬', title: '来料检验合格率', value: '99.2', unit: '%', status: 'good' },
  { icon: '⚙️', title: '过程检验合格率', value: '98.5', unit: '%', status: 'good' },
  { icon: '✅', title: '成品检验合格率', value: '99.8', unit: '%', status: 'good' },
  { icon: '📉', title: '客户投诉数', value: '3', unit: '件', status: 'good' }
])

const qualityGaugeData = ref({
  iqc: 99.2,
  pqc: 98.5,
  fqc: 99.8
})

const defectTop5 = ref([
  { name: '外观缺陷', count: 23 },
  { name: '尺寸偏差', count: 15 },
  { name: '功能异常', count: 8 },
  { name: '包装损坏', count: 5 },
  { name: '标签错误', count: 3 }
])

const complaints = ref([
  { id: 'CL-2024-001', status: 'resolved', statusText: '已解决', content: 'A产品外观划痕问题', date: '2024-01-15' },
  { id: 'CL-2024-002', status: 'processing', statusText: '处理中', content: 'B产品功能异常', date: '2024-01-18' },
  { id: 'CL-2024-003', status: 'new', statusText: '新投诉', content: '包装破损', date: '2024-01-20' }
])

const totalInspect = ref('86,500')
const qualifiedCount = ref('85,248')
const defectCount = ref('252')
const rejectRate = ref('0.3%')
const customerSatisfaction = ref(98.5)

// 不良品分布图
const defectOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' }
  },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['50%', '50%'],
    roseType: 'area',
    label: {
      formatter: '{b}\n{c}件',
      color: 'rgba(200, 220, 255, 0.8)',
      fontSize: 11
    },
    data: defectDistribution.map((item, index) => ({
      value: item.value,
      name: item.name,
      itemStyle: { 
        color: ['#ff4757', '#ffa500', '#5c7cfa', '#00d4aa', '#a0a0a0'][index] 
      }
    }))
  }]
}))

// 质量趋势图
const qualityTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 35, 65, 0.9)',
    borderColor: 'rgba(60, 120, 216, 0.5)',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c}%'
  },
  grid: {
    left: 50,
    right: 20,
    top: 20,
    bottom: 30
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    axisLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.3)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.7)', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    min: 95,
    max: 100,
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(60, 120, 216, 0.2)' } },
    axisLabel: { color: 'rgba(200, 220, 255, 0.7)', formatter: '{value}%' }
  },
  series: [{
    type: 'line',
    smooth: true,
    data: [98.2, 98.5, 98.8, 99.0, 98.7, 99.2],
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
    },
    markLine: {
      silent: true,
      lineStyle: { color: 'rgba(60, 120, 216, 0.5)', type: 'dashed' },
      data: [{ yAxis: 98 }]
    }
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
    min-width: 200px;
    
    &.highlight {
      border-color: rgba(0, 212, 170, 0.3);
    }
    
    .card-icon {
      font-size: 28px;
    }
    
    .card-info {
      flex: 1;
      
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
    
    .card-status {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      
      &.good {
        background: rgba(0, 212, 170, 0.2);
        color: #00d4aa;
      }
      &.warning {
        background: rgba(255, 165, 0, 0.2);
        color: #ffa500;
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

.defect-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .defect-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: rgba(255, 71, 87, 0.1);
    border-radius: 6px;
    border-left: 3px solid #ff4757;
    
    .defect-rank {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 71, 87, 0.2);
      color: #ff4757;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
    }
    
    .defect-name {
      flex: 1;
      font-size: 13px;
      color: rgba(200, 220, 255, 0.9);
    }
    
    .defect-count {
      font-size: 13px;
      color: #ff4757;
      font-weight: 600;
    }
  }
}

.complaint-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .complaint-item {
    padding: 10px 12px;
    background: rgba(60, 120, 216, 0.1);
    border-radius: 8px;
    
    .complaint-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      
      .complaint-id {
        font-size: 12px;
        color: rgba(200, 220, 255, 0.6);
      }
      
      .complaint-status {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        
        &.resolved { background: rgba(0, 212, 170, 0.2); color: #00d4aa; }
        &.processing { background: rgba(255, 165, 0, 0.2); color: #ffa500; }
        &.new { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
      }
    }
    
    .complaint-content {
      font-size: 13px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 4px;
    }
    
    .complaint-date {
      font-size: 11px;
      color: rgba(200, 220, 255, 0.5);
    }
  }
}

.center-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .quality-main {
    background: linear-gradient(135deg, rgba(30, 50, 90, 0.5), rgba(20, 35, 65, 0.4));
    border: 1px solid rgba(60, 120, 216, 0.3);
    border-radius: 16px;
    padding: 30px;
    text-align: center;
    width: 100%;
    
    .main-title {
      font-size: 18px;
      color: rgba(200, 220, 255, 0.9);
      margin-bottom: 24px;
    }
    
    .quality-gauges {
      display: flex;
      justify-content: center;
      gap: 40px;
      
      .gauge-item {
        text-align: center;
        
        .gauge-circle {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 10px;
          
          svg {
            width: 100%;
            height: 100%;
          }
          
          .gauge-value {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            font-weight: bold;
            color: #fff;
          }
        }
        
        .gauge-label {
          font-size: 13px;
          color: rgba(200, 220, 255, 0.7);
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
  
  .stat-item {
    text-align: center;
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      font-family: 'UniDreamLED', sans-serif;
      
      &.warning {
        color: #ff4757;
      }
    }
    
    .stat-label {
      font-size: 12px;
      color: rgba(200, 220, 255, 0.6);
      margin-top: 4px;
    }
  }
}
</style>
