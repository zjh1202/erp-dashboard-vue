<template>
  <div class="nav-bar">
    <div class="nav-item" 
         v-for="item in navItems" 
         :key="item.path"
         :class="{ active: currentRoute === item.path }"
         @click="goTo(item.path)">
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.path)

const navItems = [
  { name: '总览', path: '/overview', icon: '📊' },
  { name: '生产', path: '/production', icon: '🏭' },
  { name: '质量', path: '/quality', icon: '✅' },
  { name: '设备', path: '/equipment', icon: '⚙️' },
  { name: '能耗', path: '/energy', icon: '⚡' }
]

const goTo = (path: string) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(20, 35, 65, 0.95), rgba(15, 25, 50, 0.9));
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  z-index: 1000;
  border-bottom: 1px solid rgba(60, 120, 216, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  
  &:hover {
    background: rgba(60, 120, 216, 0.2);
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(60, 120, 216, 0.4), rgba(30, 80, 180, 0.3));
    border: 1px solid rgba(60, 120, 216, 0.5);
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .nav-text {
    font-size: 15px;
    color: rgba(200, 220, 255, 0.9);
    font-weight: 500;
  }
}
</style>
