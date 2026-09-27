## Descriptions

Display details in a table with configurable columns, borders and direction.

:::demo

```html
<template><div><rumo-button @click="vertical = !vertical">Toggle direction</rumo-button>
  <rumo-descriptions title="User details" :column="2" border :direction="vertical ? 'vertical' : 'horizontal'" :label-width="120">
    <rumo-descriptions-item label="Name">Alex</rumo-descriptions-item>
    <rumo-descriptions-item label="Team" :width="180">Product</rumo-descriptions-item>
    <rumo-descriptions-item label="Note" :span="2">Wide content</rumo-descriptions-item>
  </rumo-descriptions></div></template>
<script>export default { data() { return { vertical: false }; } };</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| border | Show borders | boolean | false |
| column | Columns per row | number | 3 |
| direction | horizontal / vertical | string | horizontal |
| size | large / medium / small | string | — |
| title | Heading | string | — |
| extra | Right side text | string | — |
| labelWidth | Label column width | string / number | — |

### Slots

| Name | Description |
| --- | --- |
| default | DescriptionsItem components |
| title / extra | Custom header content |
