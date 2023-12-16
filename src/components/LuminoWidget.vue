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
import { BoxPanel, Widget } from '@lumino/widgets'
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import { CustomDockPanel, Item, ItemWidget } from './ItemWidget'

const props = defineProps(['item', 'closable', 'titleClass', 'titleActiveClass'])
const emits = defineEmits(['close', 'active', 'deActive', 'show', 'hide'])
const boxPanel: BoxPanel | undefined = inject('boxPanel')
const dockPanel: CustomDockPanel | undefined = inject('dockPanel')
const realEl = ref()

const createTitleClass = (active: boolean) => {
  return active ? `${props.titleClass || 'lumino-tab'} ${props.titleActiveClass || 'lumino-tab-active'}` : `${props.titleClass || 'lumino-tab'}`
}

const onLuminoWidgetClose = (msg: Message) => {
  emits('close', { msg, item: props.item, widget: luminoWidget })
}

const onLuminoWidgetActive = (msg: Message) => {
  dockPanel!.currentWidget = luminoWidget
  luminoWidget.title.className = createTitleClass(true)
  emits('active', { msg, item: props.item, widget: luminoWidget })
}

const onLuminoWidgetDeActive = (msg: Message) => {
  luminoWidget.title.className = createTitleClass(false)
  emits('deActive', { msg, item: props.item, widget: luminoWidget })
}

const onLuminoWidgetShow = (msg: Message) => {
  luminoWidget.title.className = createTitleClass(true)
  emits('show', { msg, item: props.item, widget: luminoWidget })
}

const onLuminoWidgetHide = (msg: Message) => {
  luminoWidget.title.className = createTitleClass(false)
  emits('hide', { msg, item: props.item, widget: luminoWidget })
}

const luminoWidget = new ItemWidget(props.item, {
  closable: props.closable,
  onClose: onLuminoWidgetClose,
  onActive: onLuminoWidgetActive,
  onDeActive: onLuminoWidgetDeActive,
  onShow: onLuminoWidgetShow,
  onHide: onLuminoWidgetHide
})

watch(() => props.item, (newItem: Item, oldItem: Item) => {
  luminoWidget.title.label = newItem.name
}, { deep: true })

watch(() => props.titleActiveClass, (newClass: string, oldClass: string) => {
  luminoWidget.title.className = createTitleClass(luminoWidget === dockPanel!.currentWidget)
})

watch(() => props.titleClass, (newClass: string, oldClass: string) => {
  luminoWidget.title.className = createTitleClass(luminoWidget === dockPanel!.currentWidget)
})

onMounted(() => {
  const widgets = dockPanel!.widgets()
  if (!Array.from(widgets).find((w: Widget) => {
    return w.id === props.item.id
  })) {
    dockPanel!.addWidget(luminoWidget, { ref: dockPanel!.currentWidget })
    nextTick(() => {
      document.getElementById(props.item.id)?.appendChild(realEl.value)
      dockPanel!.activateWidget(luminoWidget)
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