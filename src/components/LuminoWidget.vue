<template>
  <div v-show="false">
    <div class="lumino-widget"
         ref="realEl">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@lumino/messaging'
import { BoxPanel, DockPanel, Widget } from '@lumino/widgets'
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import { ItemWidget, Item } from './ItemWidget'

const props = defineProps(['item', 'closable'])
const emits = defineEmits(['close', 'active'])
const boxPanel: BoxPanel | undefined = inject('boxPanel')
const dockPanel: DockPanel | undefined = inject('dockPanel')
const realEl = ref()
const onLuminoWidgetClose = (msg: Message) => {
  emits('close', { msg, item: props.item, widget: luminoWidget })
}

const onLuminoWidgetActive = (msg: Message) => {
  emits('close', { msg, item: props.item, widget: luminoWidget })
}
const luminoWidget = new ItemWidget(props.item, {
  closable: props.closable,
  onClose: onLuminoWidgetClose,
  onActive: onLuminoWidgetActive
})

watch(() => props.item, (newItem: Item, oldItem: Item) => {
  luminoWidget.title.label = newItem.name
}, { deep: true })

onMounted(() => {
  const widgets = dockPanel!.widgets()
  if (!Array.from(widgets).find((w: Widget) => {
    return w.id === props.item.id
  })) {
    dockPanel!.addWidget(luminoWidget)
    nextTick(() => {
      document.getElementById(props.item.id)?.appendChild(realEl.value)
    })
  }
})
</script>

<style scoped lang="scss">
.lumino-widget {
  display: flex;
  flex: 1;
}
</style>