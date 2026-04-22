// Capacity Utilization Data
export const capacityUtilization = [
  { name: 'Stamping', value: 92.5 },
  { name: 'Welding', value: 88.3 },
  { name: 'Painting', value: 95.8 },
  { name: 'Assembly', value: 91.2 },
  { name: 'Testing', value: 78.6 },
  { name: 'Logistics', value: 85.4 }
]

// Production Progress Data
export const productionProgress = [
  { name: 'Plan', value: 10000, unit: 'pcs' },
  { name: 'Completed', value: 8650, unit: 'pcs' },
  { name: 'Quality Rate', value: 98.5, unit: '%' },
  { name: 'WIP', value: 1350, unit: 'pcs' }
]

// Output Ranking
export const outputRanking = [
  { label: 'Product A', value: 45600 },
  { label: 'Product B', value: 38900 },
  { label: 'Product C', value: 32400 },
  { label: 'Product D', value: 27800 },
  { label: 'Product E', value: 21500 }
]

// Monthly Capacity Trend
export const monthlyCapacityTrend = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  actual: [85, 78, 92, 88, 95, 91, 94, 89, 96, 93, 97, 95],
  target: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90]
}

// Equipment Status
export const equipmentStatus = [
  { name: 'Normal', value: 156, color: '#00d4aa' },
  { name: 'Maintenance', value: 12, color: '#ffa500' },
  { name: 'Down', value: 3, color: '#ff4757' },
  { name: 'Idle', value: 8, color: '#5c7cfa' }
]

// OEE Data
export const oeeData = {
  availability: 92.5,
  performance: 88.3,
  quality: 97.8,
  oee: 79.8
}

// Quality Metrics
export const qualityMetrics = [
  { name: 'Incoming QC', value: 99.2 },
  { name: 'Process QC', value: 98.5 },
  { name: 'Final QC', value: 99.8 },
  { name: 'Complaints', value: 3 }
]

// Defect Distribution
export const defectDistribution = [
  { name: 'Appearance', value: 23 },
  { name: 'Dimension', value: 15 },
  { name: 'Function', value: 8 },
  { name: 'Packaging', value: 5 },
  { name: 'Other', value: 4 }
]

// Energy Consumption
export const energyConsumption = {
  electricity: { value: 125600, unit: 'kWh', trend: 3.2 },
  gas: { value: 8500, unit: 'm³', trend: -1.5 },
  water: { value: 3200, unit: 't', trend: 0.8 }
}

// Team Ranking
export const teamRanking = [
  { team: 'Team 1', output: 3250, rate: 99.2 },
  { team: 'Team 2', output: 3180, rate: 98.8 },
  { team: 'Team 3', output: 3120, rate: 99.5 },
  { team: 'Team 4', output: 3080, rate: 98.2 },
  { team: 'Team 5', output: 2950, rate: 97.9 }
]
