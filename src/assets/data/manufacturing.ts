// 产能利用率数据
export const capacityUtilization = [
  { name: '冲压车间', value: 92.5 },
  { name: '焊接车间', value: 88.3 },
  { name: '涂装车间', value: 95.8 },
  { name: '总装车间', value: 91.2 },
  { name: '检测车间', value: 78.6 },
  { name: '物流中心', value: 85.4 }
]

// 生产进度数据
export const productionProgress = [
  { name: '今日计划', value: 10000, unit: '件' },
  { name: '已完成', value: 8650, unit: '件' },
  { name: '合格率', value: 98.5, unit: '%' },
  { name: '在制品', value: 1350, unit: '件' }
]

// 产量排名
export const outputRanking = [
  { label: 'A系列产品', value: 45600 },
  { label: 'B系列产品', value: 38900 },
  { label: 'C系列产品', value: 32400 },
  { label: 'D系列产品', value: 27800 },
  { label: 'E系列产品', value: 21500 }
]

// 月度产能趋势
export const monthlyCapacityTrend = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  actual: [85, 78, 92, 88, 95, 91, 94, 89, 96, 93, 97, 95],
  target: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90]
}

// 设备运行状态
export const equipmentStatus = [
  { name: '正常运行', value: 156, color: '#00d4aa' },
  { name: '维护中', value: 12, color: '#ffa500' },
  { name: '故障停机', value: 3, color: '#ff4757' },
  { name: '待产能', value: 8, color: '#5c7cfa' }
]

// OEE数据
export const oeeData = {
  availability: 92.5,
  performance: 88.3,
  quality: 97.8,
  oee: 79.8
}

// 质量指标
export const qualityMetrics = [
  { name: '来料检验合格率', value: 99.2 },
  { name: '过程检验合格率', value: 98.5 },
  { name: '成品检验合格率', value: 99.8 },
  { name: '客户投诉数', value: 3 }
]

// 不良品分布
export const defectDistribution = [
  { name: '外观缺陷', value: 23 },
  { name: '尺寸偏差', value: 15 },
  { name: '功能异常', value: 8 },
  { name: '包装损坏', value: 5 },
  { name: '其他', value: 4 }
]

// 能耗数据
export const energyConsumption = {
  electricity: { value: 125600, unit: 'kWh', trend: 3.2 },
  gas: { value: 8500, unit: 'm³', trend: -1.5 },
  water: { value: 3200, unit: 't', trend: 0.8 }
}

// 班组排名
export const teamRanking = [
  { team: '一班', output: 3250, rate: 99.2 },
  { team: '二班', output: 3180, rate: 98.8 },
  { team: '三班', output: 3120, rate: 99.5 },
  { team: '四班', output: 3080, rate: 98.2 },
  { team: '五班', output: 2950, rate: 97.9 }
}
