## Splitpanes

Drag the separator to resize panes. Tab focuses it; arrow keys move by 1%, Shift + arrow by 10%, and Home/End move to the allowed boundary. Double-click maximizes the following pane.

:::demo

```html
<template>
  <div>
    <rumo-splitpanes style="height: 180px" @resized="onResized">
      <rumo-split-pane :size="35" :min="0" :max="80">Left</rumo-split-pane>
      <rumo-split-pane :min="20">Right</rumo-split-pane>
    </rumo-splitpanes>
    <p>Pane widths: {{ sizes }}</p>
  </div>
</template>
<script>
export default {
  data() { return { sizes: '' }; },
  methods: { onResized(panes) { this.sizes = panes.map(pane => Math.round(pane.size) + '%').join(' / '); } }
};
</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| horizontal | Stack panes vertically | boolean | false |
| pushOtherPanes | Push further panes while resizing | boolean | true |
| dblClickSplitter | Maximize the following pane on double-click | boolean | true |
| rtl | Reverse horizontal drag direction | boolean | false |
| firstSplitter | Decorative first separator | boolean | false |

### Events

| Event | Description |
| --- | --- |
| ready | Initialized |
| resize / resized | During / after resize; receives pane sizes |
| pane-add / pane-remove | Pane added / removed; receives index and sizes |
| pane-click / splitter-click | Pane / separator clicked |
| pane-maximize | Following pane maximized |
