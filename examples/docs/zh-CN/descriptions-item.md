## DescriptionsItem 描述项

放入 Descriptions 内，可设置标签、跨列和列宽。

:::demo

```html
<rumo-descriptions :column="2" border>
  <rumo-descriptions-item label="编号" :width="120">A-01</rumo-descriptions-item>
  <rumo-descriptions-item label="状态" align="right">正常</rumo-descriptions-item>
</rumo-descriptions>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | string | — |
| span / rowspan | 跨列 / 跨行数 | number | 1 |
| width / minWidth | 列宽 / 最小宽度 | string / number | — |
| labelWidth | 当前项标签宽度 | string / number | — |
| align / labelAlign | 内容 / 标签对齐 | left / center / right | left |
| className / labelClassName | 自定义内容 / 标签类名 | string | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 内容 |
| label | 标签内容 |
