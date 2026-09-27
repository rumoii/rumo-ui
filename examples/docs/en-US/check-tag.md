## CheckTag

Click or press Enter/Space to toggle the tag.

:::demo

```html
<template><rumo-check-tag :checked.sync="checked">Selectable tag</rumo-check-tag></template>
<script>export default { data() { return { checked: false }; } };</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Selected state; supports `.sync` | boolean | false |
| disabled | Disabled state | boolean | false |
| type | primary / success / info / warning / danger | string | primary |

### Events / Slots

| Name | Description |
| --- | --- |
| update:checked | Request a selected state update |
| change | Selection changed |
| default | Tag content |
