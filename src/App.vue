<template>
  <div class="container">
    <h4>Vue3 Lumino Widget</h4>
    <h6>BoxPanel with dock layout Drag and drop the tab item</h6>
    <h6>Current active: {{ active?.item.name || 'none' }}</h6>
    <LuminoBoxPanel>
      <LuminoWidget v-for="item in items"
                    :key="item.id"
                    @close="onWidgetInBoxPanelClose"
                    @active="onWidgetInBoxPanelActive"
                    @show="onWidgetInBoxPanelShow"
                    :title-active-class="activeClass"
                    :closable="item.closable"
                    :item="item">
        <p class="item-component">{{ item.name }}</p>
      </LuminoWidget>
    </LuminoBoxPanel>

    <h6>TabPanel</h6>
    <LuminoTabPanel>
      <LuminoWidget v-for="item in tabItems"
                    :key="item.id"
                    @close="onWidgetInTabPanelClose"
                    @active="onWidgetInTabPanelActive"
                    @show="onWidgetInTabPanelShow"
                    :title-active-class="activeClass"
                    :closable="item.closable"
                    :item="item">
        <p class="item-component">{{ item.name }}</p>
      </LuminoWidget>
    </LuminoTabPanel>
  </div>
</template>

<script setup lang="ts">
import LuminoBoxPanel from "./components/LuminoBoxPanel.vue"
import LuminoTabPanel from "./components/LuminoTabPanel.vue"
import LuminoWidget from "./components/LuminoWidget.vue"
import { ref } from 'vue'
import { ItemWidget, WidgetEvent } from "./components/ItemWidget"

const items = ref([
  { id: 'id1', name: 'item1', closable: false },
  { id: 'id2', name: 'item2' }
])

const tabItems = ref([
  { id: 'tid1', name: 'item1', closable: false },
  { id: 'tid2', name: 'item2' }
])

const active = ref<ItemWidget>()

const onWidgetInBoxPanelClose = ({ msg, widget, item }: WidgetEvent) => {
  // do some thing, then doClose item.
  widget.doClose(msg)
}

const onWidgetInBoxPanelActive = ({ msg, widget, item }: WidgetEvent) => {
  active.value = widget
}

const onWidgetInBoxPanelShow = ({ msg, widget, item }: WidgetEvent) => {
  active.value = widget
}

const activeClass = ref('item-active-0')
let onOff = false

setInterval(() => {
  onOff = !onOff
  activeClass.value = onOff ? 'item-active-0' : 'item-active-1'
}, 1000)


const activeTab = ref<ItemWidget>()

const onWidgetInTabPanelClose = ({ msg, widget, item }: WidgetEvent) => {
  // do some thing, then doClose item.
  widget.doClose(msg)
}

const onWidgetInTabPanelActive = ({ msg, widget, item }: WidgetEvent) => {
  activeTab.value = widget
}

const onWidgetInTabPanelShow = ({ msg, widget, item }: WidgetEvent) => {
  activeTab.value = widget
}

</script>

<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;

  h4,
  h6 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  :deep(.item-active-0) {
    border-top: orange 2px solid;
  }

  :deep(.item-active-1) {
    border-top: palevioletred 2px solid;
  }

  .item-component {
    margin: 10px;
  }
}
</style>
