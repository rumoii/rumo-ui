## Descriptions 描述列表

以表格展示详情，支持列数、边框和竖排。

:::demo

```html
<template><div><rumo-button @click="vertical = !vertical">切换方向</rumo-button>
  <rumo-descriptions title="用户详情" :column="2" border :direction="vertical ? 'vertical' : 'horizontal'" :label-width="120">
    <rumo-descriptions-item label="姓名">小明</rumo-descriptions-item>
    <rumo-descriptions-item label="部门" :width="180">产品部</rumo-descriptions-item>
    <rumo-descriptions-item label="备注" :span="2">跨列内容</rumo-descriptions-item>
  </rumo-descriptions></div></template>
<script>export default { data() { return { vertical: false }; } };</script>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| border | 显示边框 | boolean | false |
| column | 每行列数 | number | 3 |
| direction | horizontal / vertical | string | horizontal |
| size | large / medium / small | string | — |
| title | 标题 | string | — |
| extra | 右侧文本 | string | — |
| labelWidth | 标签列宽 | string / number | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | DescriptionsItem 列表 |
| title / extra | 自定义标题和右侧内容 |
