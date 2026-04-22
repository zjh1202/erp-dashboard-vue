<template>
  <div class="echarts" ref="echartsRef"></div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const prop = withDefaults(defineProps<{ option: any }>(), {
  option: () => ({})
})

const state = reactive({
  option: null
})

watch(
  () => prop.option,
  (newOption) => {
    state.option = newOption
    if (state.option && echartsInstance) {
      echartsInstance.setOption(state.option, true)
    }
  },
  { immediate: false, deep: true }
)

let echartsInstance: echarts.ECharts | null = null
const echartsRef = ref()

const echartsResize = () => {
  echartsInstance?.resize()
}

const emit = defineEmits(['eclick', 'onload'])

onMounted(() => {
  state.option = prop.option
  if (!echartsInstance) {
    echartsInstance = echarts.init(echartsRef.value as HTMLDivElement)
    
    echartsInstance.on('click', function (val) {
      emit('eclick', val)
    })
    
    if (state.option) {
      echartsInstance.setOption(state.option)
    }
  }
  
  window.addEventListener('resize', echartsResize)
})

onBeforeUnmount(() => {
  if (!echartsInstance) return
  window.removeEventListener('resize', echartsResize)
  echartsInstance.dispose()
})

defineExpose({
  setOption: (option: any) => echartsInstance?.setOption(option)
})
</script>

<style scoped lang="scss">
.echarts {
  position: relative;
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
