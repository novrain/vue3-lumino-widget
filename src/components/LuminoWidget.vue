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
import { TabPanel, Widget } from '@lumino/widgets'
import { inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { CustomDockPanel, Item, ItemWidget } from './ItemWidget'

const props = withDefaults(defineProps<{
  item: Item,
  closable?: boolean,
  titleClass?: string,
  titleActiveClass?: string
}>(), { closable: true, titleClass: 'lumino-tab', titleActiveClass: 'lumino-tab-active' })
const emits = defineEmits(['close', 'active', 'deActive', 'show', 'hide'])
// const boxPanel: BoxPanel | undefined = inject('boxPanel')
const container: CustomDockPanel | TabPanel | undefined = inject('container')
const realEl = ref()

const createTitleClass = (active: boolean) => {
  return active ? `${props.titleClass || 'lumino-tab'} ${props.titleActiveClass || 'lumino-tab-active'}` : `${props.titleClass || 'lumino-tab'}`
}

const onLuminoWidgetClose = (msg: Message) => {
  emits('close', { msg, item: props.item, widget: luminoWidget })
}

const onLuminoWidgetActive = (msg: Message) => {
  container!.currentWidget = luminoWidget
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
  luminoWidget.title.label = newItem.name || ''
}, { deep: true })

watch(() => props.titleActiveClass, (newClass: string, oldClass: string) => {
  luminoWidget.title.className = createTitleClass(luminoWidget === container!.currentWidget)
})

watch(() => props.titleClass, (newClass: string, oldClass: string) => {
  luminoWidget.title.className = createTitleClass(luminoWidget === container!.currentWidget)
})

watch(() => props.closable, (newClosable, oldClosable) => {
  luminoWidget.title.closable = newClosable
})

onMounted(() => {
  let widgets = [] as any
  if (container instanceof CustomDockPanel) {
    widgets = Array.from(container!.widgets())
  }
  if (container instanceof TabPanel) {
    widgets = container.widgets
  }
  if (!widgets.find((w: Widget) => {
    return w.id === props.item.id
  })) {
    container!.addWidget(luminoWidget, { ref: container!.currentWidget })
    nextTick(() => {
      document.getElementById(props.item.id)?.appendChild(realEl.value)
      luminoWidget.activate()
      if (container instanceof CustomDockPanel) {
        container!.activateWidget(luminoWidget)
      }
    })
  }
})

onBeforeUnmount(() => {
  if (luminoWidget.isAttached) {
    try {
      luminoWidget.doClose(Widget.Msg.CloseRequest)
    } catch (e) {
      console.log(e)
    }
  }
})

</script>

<style scoped lang="scss">
.lumino-widget {
  display: flex;
  flex: 1;
}
</style>