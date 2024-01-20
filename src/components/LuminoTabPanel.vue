<template>
  <div class="lumino-container"
       ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import './theme.css'
import { TabBar, TabPanel, Widget } from '@lumino/widgets'
import { onMounted, onUnmounted, onUpdated, provide, ref } from 'vue'
import { TabPanelSvg } from '../lumino-extends/Extends'

const props = withDefaults(defineProps<{ id?: string } & TabPanel.IOptions & TabBar.IOptions<any>>(),
  { addButtonEnabled: false })

const emits = defineEmits(['add'])

const tabPanel = new TabPanelSvg({
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
@import './common.scss';
</style>