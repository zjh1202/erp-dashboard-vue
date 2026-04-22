// 制造业看板类型定义

// 数据卡片
export interface DataCard {
  id: string
  title: string
  value: number | string
  unit: string
  icon: string
  color: string
  trend?: number
}

// 设备状态
export interface EquipmentStatus {
  id: string
  name: string
  status: 'running' | 'stopped' | 'warning' | 'maintenance'
  line: string
  time?: string
}

// 生产趋势数据
export interface ProductionTrend {
  time: string
  planned: number
  actual: number
  efficiency: number
}

// OEE数据
export interface OEEData {
  availability: number
  performance: number
  quality: number
  oee: number
}

// 工单数据
export interface WorkOrder {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed'
  progress: number
  priority: 'high' | 'medium' | 'low'
}

// 底部滚动数据
export interface BottomScrollItem {
  id: string
  equipment: string
  status: string
  value: string
  time: string
}
