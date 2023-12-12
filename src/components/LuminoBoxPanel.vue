<template>
  <div class="lumino-container"
       ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import "@fortawesome/fontawesome-free/css/all.css"
import '@lumino/default-theme/style/index.css'
import { BoxPanel, DockPanel, Widget } from '@lumino/widgets'
import { provide, onMounted, onUpdated, ref, onUnmounted } from 'vue'
const boxPanel = new BoxPanel({ direction: 'left-to-right', spacing: 0 })
const dockPanel = new DockPanel()
boxPanel.id = 'box-panel'
dockPanel.id = 'dock-panel'

provide('boxPanel', boxPanel)
provide('dockPanel', dockPanel)

const container = ref<HTMLElement | null>(null)

const onWindowResize = () => {
  boxPanel.update()
}

onMounted(() => {
  boxPanel.addWidget(dockPanel)
  BoxPanel.setStretch(dockPanel, 1)
  if (container.value) {
    Widget.attach(boxPanel, container.value)
  }

  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})

onUpdated(() => {
  boxPanel.update()
})
</script>

<style lang="scss" scoped>
.lumino-container {
  display: flex;
  flex: 1;
  
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