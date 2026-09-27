## SplitPane 面板

SplitPane 在 Splitpanes 内使用，size、min、max 都是容器的百分比。

:::demo

```html
<rumo-splitpanes style="height: 160px" horizontal>
  <rumo-split-pane :size="40" :min="20" :max="70">上方</rumo-split-pane>
  <rumo-split-pane :min="20">下方</rumo-split-pane>
</rumo-splitpanes>
```

:::

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 初始尺寸或外部更新尺寸（%） | number / string | — |
| min | 最小尺寸（%） | number / string | 0 |
| max | 最大尺寸（%） | number / string | 100 |
