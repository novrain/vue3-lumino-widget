<template>
  <div class="container">
    <h4>Vue3 Lumino Widget</h4>
    <h6>Drag and drop the tab item</h6>
    <LuminoBoxPanel>
      <LuminoWidget v-for="item in items"
                    :key="item.id"
                    @close="onLuminoWidgetClose"
                    @active="onLuminoWidgetActive"
                    :item="item">
        <p class="item-component">{{ item.name }}</p>
      </LuminoWidget>
    </LuminoBoxPanel>
  </div>
</template>

<script setup lang="ts">
import LuminoBoxPanel from "./components/LuminoBoxPanel.vue"
import LuminoWidget from "./components/LuminoWidget.vue"
import { ref } from 'vue'
import { WidgetEvent } from "./components/ItemWidget"

const items = ref([
  { id: 'id1', name: 'item1' },
  { id: 'id2', name: 'item2' }
])


const onLuminoWidgetClose = ({ msg, widget, item }: WidgetEvent) => {
  // do some thing, then doClose item.
  widget.doClose(msg)
}

const onLuminoWidgetActive = ({ msg, widget, item }: WidgetEvent) => {
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

  .item-component {
    margin: 10px;
  }
}
</style>
