## Skeleton 骨架屏

加载时展示占位内容，加载完成后展示默认插槽。

:::demo

```html
<template><div><rumo-button @click="loading = !loading">切换加载</rumo-button>
  <rumo-skeleton :loading="loading" animated :rows="3"><p>真实内容已加载</p></rumo-skeleton>
</div></template>
<script>export default { data() { return { loading: true }; } };</script>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否显示骨架 | boolean | true |
| animated | 是否启用加载动画 | boolean | false |
| count | 骨架重复次数 | number | 1 |
| rows | 默认段落行数 | number | 3 |
| throttle | 切换延迟；对象可设 leading/trailing | number / object | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 实际内容 |
| template | 自定义骨架模板 |
