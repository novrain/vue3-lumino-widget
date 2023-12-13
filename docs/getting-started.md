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
// this style include the lumino style; but lumino depends on the fontawsome for icon, it too big
// if your project already using it, it's well, if not, maybe you can replace the "X" icon by css using other font.
import 'vue3-lumino-widget/dist/style.css'
// import "@fortawesome/fontawesome-free/css/all.css"
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
