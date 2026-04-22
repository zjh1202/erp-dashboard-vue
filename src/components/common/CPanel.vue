<template>
  <div class="panel">
    <div class="panel-header">
      <slot name="header">默认名称</slot>
    </div>
    <div class="panel-container">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.panel {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(30, 50, 90, 0.4), rgba(20, 35, 65, 0.3));
  border: 1px solid rgba(60, 120, 216, 0.3);
  border-radius: 12px;
  overflow: hidden;
  
  &-header {
    position: relative;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, 
      rgba(60, 120, 216, 0.1), 
      rgba(60, 120, 216, 0.3), 
      rgba(60, 120, 216, 0.1));
    border-bottom: 1px solid rgba(60, 120, 216, 0.3);
    font-size: 18px;
    font-weight: 600;
    color: rgba(200, 220, 255, 0.95);
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(60, 120, 216, 0.5);
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(60, 120, 216, 0.8), transparent);
    }
    
    &::before {
      left: 30px;
    }
    
    &::after {
      right: 30px;
    }
  }
  
  &-container {
    position: relative;
    flex: 1;
    padding: 16px 20px;
    overflow: hidden;
  }
}
</style>
