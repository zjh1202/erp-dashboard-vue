import type { DataCard, EquipmentStatus, ProductionTrend, BottomScrollItem } from '@/types'

// 左侧数据卡片
export const leftDataCards: DataCard[] = [
  {
    id: 'work-order',
    title: '执行工单数',
    value: 32,
    unit: '单',
    icon: '📋',
    color: '#3b82f6',
    trend: 12.5
  },
  {
    id: 'production',
    title: '生产报工数量',
    value: 156,
    unit: '件',
    icon: '🏭',
    color: '#10b981',
    trend: 8.3
  },
  {
    id: 'quality',
    title: '产品合格率',
    value: 92.5,
    unit: '%',
    icon: '✅',
    color: '#f59e0b',
    trend: -2.1
  },
  {
    id: 'oee',
    title: '设备综合效率OEE',
    value: 98.2,
    unit: '%',
    icon: '⚙️',
    color: '#8b5cf6',
    trend: 5.7
  }
]

// 生产趋势数据
export const productionTrendData: ProductionTrend[] = [
  { time: '08:00', planned: 100, actual: 95, efficiency: 95 },
  { time: '10:00', planned: 200, actual: 185, efficiency: 92.5 },
  { time: '12:00', planned: 300, actual: 280, efficiency: 93.3 },
  { time: '14:00', planned: 400, actual: 375, efficiency: 93.8 },
  { time: '16:00', planned: 500, actual: 480, efficiency: 96 },
  { time: '18:00', planned: 600, actual: 590, efficiency: 98.3 }
]

// 底部滚动数据 - 设备状态
export const bottomScrollData: BottomScrollItem[] = [
  { id: '1', equipment: '冲压机-01', status: '正常运行', value: '1250件', time: '10:23' },
  { id: '2', equipment: '焊接机-02', status: '维护中', value: '停机', time: '09:45' },
  { id: '3', equipment: '涂装线-01', status: '正常运行', value: '89%', time: '10:20' },
  { id: '4', equipment: 'CNC-03', status: '警告', value: '温度高', time: '10:18' },
  { id: '5', equipment: '组装线-A', status: '正常运行', value: '156件', time: '10:22' },
  { id: '6', equipment: '检测机-01', status: '正常运行', value: '99.2%', time: '10:21' },
  { id: '7', equipment: '包装机-02', status: '待机', value: '0件', time: '10:15' },
  { id: '8', equipment: '冲压机-02', status: '正常运行', value: '1180件', time: '10:23' }
]

// 设备状态分布
export const equipmentStatusData = [
  { name: '正常运行', value: 156, color: '#10b981' },
  { name: '维护中', value: 12, color: '#f59e0b' },
  { name: '故障停机', value: 3, color: '#ef4444' },
  { name: '待机', value: 8, color: '#6b7280' }
]

// OEE数据
export const oeeData = {
  availability: 95.8,
  performance: 92.3,
  quality: 98.5,
  oee: 87.2
}

// 工单执行进度
export const workOrderProgress = [
  { name: '工单A-001', progress: 85, status: 'processing' },
  { name: '工单B-023', progress: 100, status: 'completed' },
  { name: '工单C-015', progress: 45, status: 'processing' },
  { name: '工单D-008', progress: 20, status: 'processing' }
]
