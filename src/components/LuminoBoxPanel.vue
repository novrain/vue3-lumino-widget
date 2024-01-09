<template>
  <div class="lumino-container"
       ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// import "@fortawesome/fontawesome-free/css/all.css"
import '@lumino/default-theme/style/index.css'
import { BoxPanel, TabBar, DockPanel, Widget } from '@lumino/widgets'
import { onMounted, onUnmounted, onUpdated, provide, ref } from 'vue'
import { CustomDockPanel } from './ItemWidget'

const props = withDefaults(defineProps<{ id?: string } & BoxPanel.IOptions & DockPanel.IOptions>(),
  { tabsConstrained: false, addButtonEnabled: false, tabsMovable: true })

const emits = defineEmits(['add'])

const boxPanel = new BoxPanel({ ...(props as any) })
const dockPanel = new CustomDockPanel({ ...(props as any) })
boxPanel.id = (props.id || 'panel') + '-box'
boxPanel.addClass('lumino-box-panel')
dockPanel.id = (props.id || 'panel') + '-dock'

provide('container', dockPanel)

const container = ref<HTMLElement | null>(null)

const onAddRequest = (source: CustomDockPanel, tabBar: TabBar<Widget>) => {
  if (tabBar.currentTitle) {
    tabBar.currentTitle.owner.activate()
    emits('add')
  }
}

dockPanel.addRequested.connect(onAddRequest)

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

  :deep(.lm-mod-current) {
    border-top: #00000060 2px solid;
  }

  :deep(.lumino-tab-active) {
    border-top: #000000AA 2px solid;
  }

  :deep(.lumino-box-panel),
  :deep(#panel-box) {
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