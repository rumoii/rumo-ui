## Splitpanes 分割面板

拖动分隔条调整面板。分隔条可用 Tab 聚焦，方向键每次调整 1%，Shift 加方向键调整 10%，Home/End 移到约束边界。双击分隔条会最大化其后的面板。

:::demo

```html
<template>
  <div>
    <rumo-splitpanes style="height: 180px" @resized="onResized">
      <rumo-split-pane :size="35" :min="0" :max="80">左侧</rumo-split-pane>
      <rumo-split-pane :min="20">右侧</rumo-split-pane>
    </rumo-splitpanes>
    <p>面板宽度：{{ sizes }}</p>
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

### Splitpanes 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| horizontal | 上下排列 | boolean | false |
| pushOtherPanes | 拖动时可推挤其他面板 | boolean | true |
| dblClickSplitter | 双击最大化后一面板 | boolean | true |
| rtl | 从右向左计算水平拖动 | boolean | false |
| firstSplitter | 首面板前增加装饰分隔条 | boolean | false |

### 事件

| 事件 | 说明 |
| --- | --- |
| ready | 初始化完成 |
| resize / resized | 拖动中 / 调整结束，参数为面板尺寸数组 |
| pane-add / pane-remove | 面板增删，参数含索引与尺寸 |
| pane-click / splitter-click | 点击面板 / 分隔条 |
| pane-maximize | 双击最大化，参数为面板尺寸 |
