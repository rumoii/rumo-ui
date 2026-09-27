## Skeleton

Show placeholder content while loading.

:::demo

```html
<template><div><rumo-button @click="loading = !loading">Toggle loading</rumo-button>
  <rumo-skeleton :loading="loading" animated :rows="3"><p>Loaded content</p></rumo-skeleton>
</div></template>
<script>export default { data() { return { loading: true }; } };</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| loading | Show placeholder | boolean | true |
| animated | Animate placeholder | boolean | false |
| count | Repetitions | number | 1 |
| rows | Default paragraph rows | number | 3 |
| throttle | Transition delay; leading/trailing object accepted | number / object | — |

### Slots

| Name | Description |
| --- | --- |
| default | Loaded content |
| template | Custom placeholder |
