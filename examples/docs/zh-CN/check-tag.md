## CheckTag 可选标签

点击或使用 Enter/空格切换选中状态。

:::demo

```html
<template><rumo-check-tag :checked.sync="checked">可选标签</rumo-check-tag></template>
<script>export default { data() { return { checked: false }; } };</script>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 是否选中，支持 `.sync` | boolean | false |
| disabled | 是否禁用 | boolean | false |
| type | primary / success / info / warning / danger | string | primary |

### Events / Slots

| 名称 | 说明 |
| --- | --- |
| update:checked | 请求更新选中状态 |
| change | 选中状态切换 |
| default | 标签内容 |
