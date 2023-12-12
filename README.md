# vue3 lumino widget

A Vue.js wrapper for jupyter lumino package

# Getting Started

Install `vue3-lumino-widget` with npm:

```bash
npm install vue3-lumino-widget
```

with yarn:

```bash
yarn add vue3-lumino-widget
```

## Usage

Import the component or register it globally in your Vue instance:

```vue
import { LuminoBoxPanel, LuminoWidget } from "vue3-lumino-widget"
import '@iota-cn/vue3-lumino-widget/dist/style.css'
```

Use the component in your template:

```vue
<LuminoBoxPanel>
  <LuminoWidget v-for="item in items"
                :key="item.id"
                @close="onLuminoWidgetClose"
                @active="onLuminoWidgetActive"
                :item="item">
    <p class="item-component">{{ item.name }}</p>
  </LuminoWidget>
</LuminoBoxPanel>
```
