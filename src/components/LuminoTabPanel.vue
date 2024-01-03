<template>
  <div class="lumino-container"
       ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// import "@fortawesome/fontawesome-free/css/all.css"
import '@lumino/default-theme/style/index.css'
import { TabBar, TabPanel, Widget } from '@lumino/widgets'
import { onMounted, onUnmounted, onUpdated, provide, ref } from 'vue'

const props = withDefaults(defineProps<{ id?: string } & TabPanel.IOptions & TabBar.IOptions<any>>(),
  { addButtonEnabled: false })

const emits = defineEmits(['add'])

const tabPanel = new TabPanel({
  ...(props as any)
})
tabPanel.id = (props.id || 'panel') + 'tab'
tabPanel.addClass('lumino-tab-panel')
provide('container', tabPanel)

const container = ref<HTMLElement | null>(null)

const onAddRequest = (source: TabPanel, tabBar: TabBar<Widget>) => {
  if (tabBar.currentTitle) {
    tabBar.currentTitle.owner.activate()
    emits('add')
  }
}

tabPanel.addRequested.connect(onAddRequest)

const onWindowResize = () => {
  tabPanel.update()
}
let sizeChangeObserver = new ResizeObserver(onWindowResize)

onMounted(() => {
  if (container.value) {
    Widget.attach(tabPanel, container.value)
    sizeChangeObserver.observe(container.value)
  }
})

onUnmounted(() => {
  sizeChangeObserver.disconnect()
})

onUpdated(() => {
  tabPanel.update()
})
</script>

<style lang="scss" scoped>
.lumino-container {
  display: flex;
  flex: 1;

  :deep(.lm-mod-current) {
    border-top: #00000060 2px solid;
  }

  :deep(.lumino-tab-active) {
    border-top: #000000AA 2px solid;
  }

  :deep(.lumino-tab-panel),
  :deep(#panel-tab) {
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