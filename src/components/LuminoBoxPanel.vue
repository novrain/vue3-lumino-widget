<template>
  <div class="lumino-container"
       ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// import "@fortawesome/fontawesome-free/css/all.css"
import '@lumino/default-theme/style/index.css'
import { BoxPanel, Widget } from '@lumino/widgets'
import { onMounted, onUnmounted, onUpdated, provide, ref } from 'vue'
import { CustomDockPanel } from './ItemWidget'

const props = withDefaults(defineProps<{
  tabsConstrained?: boolean
}>(), { tabsConstrained: false })

const boxPanel = new BoxPanel({ direction: 'left-to-right', spacing: 0 })
const dockPanel = new CustomDockPanel({ tabsConstrained: props.tabsConstrained })
boxPanel.id = 'box-panel'
dockPanel.id = 'dock-panel'

provide('boxPanel', boxPanel)
provide('dockPanel', dockPanel)

const container = ref<HTMLElement | null>(null)

const onWindowResize = () => {
  boxPanel.update()
}
let sizeChangeObserver = new ResizeObserver(onWindowResize)

onMounted(() => {
  boxPanel.addWidget(dockPanel)
  BoxPanel.setStretch(dockPanel, 1)
  if (container.value) {
    Widget.attach(boxPanel, container.value)
    sizeChangeObserver.observe(container.value)
  }
})

onUnmounted(() => {
  sizeChangeObserver.disconnect()
})

onUpdated(() => {
  boxPanel.update()
})
</script>

<style lang="scss" scoped>
.lumino-container {
  display: flex;
  flex: 1;

  :deep(.lm-mod-current){
    border-top: #00000060 2px solid;
  }

  :deep(.lumino-tab-active){
    border-top: #000000AA 2px solid;
  }
  
  :deep(#box-panel) {
    display: flex;
    flex: 1;

    .lumino-content {
      border: 1px solid #c0c0c0;
      border-top: none;
      background: white;
      position: relative;
      overflow: auto;
      display: flex;
    }
  }
}
</style>