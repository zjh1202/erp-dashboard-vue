import { createRouter, createWebHistory } from 'vue-router'
import Overview from '@/pages/Overview.vue'
import Production from '@/pages/Production.vue'
import Quality from '@/pages/Quality.vue'
import Equipment from '@/pages/Equipment.vue'
import Energy from '@/pages/Energy.vue'

const routes = [
  { path: '/', redirect: '/overview' },
  { path: '/overview', name: 'Overview', component: Overview },
  { path: '/production', name: 'Production', component: Production },
  { path: '/quality', name: 'Quality', component: Quality },
  { path: '/equipment', name: 'Equipment', component: Equipment },
  { path: '/energy', name: 'Energy', component: Energy }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
