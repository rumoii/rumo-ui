## DescriptionsItem

Use inside Descriptions to set labels, spans and widths.

:::demo

```html
<rumo-descriptions :column="2" border>
  <rumo-descriptions-item label="ID" :width="120">A-01</rumo-descriptions-item>
  <rumo-descriptions-item label="Status" align="right">Ready</rumo-descriptions-item>
</rumo-descriptions>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| label | Label text | string | — |
| span / rowspan | Column / row span | number | 1 |
| width / minWidth | Column width / minimum width | string / number | — |
| labelWidth | Item label width | string / number | — |
| align / labelAlign | Content / label alignment | left / center / right | left |
| className / labelClassName | Content / label class | string | — |

### Slots

| Name | Description |
| --- | --- |
| default | Content |
| label | Label content |
