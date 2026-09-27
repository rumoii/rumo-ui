## Countup

Animate a number from `start` to `value`. Updating `value` replays the count and emits `complete` when it finishes.

:::demo

```html
<template>
  <div>
    <rumo-countup v-if="show" :start="0" :value="value" :duration="1.2" :decimals="2" separator="," prefix="$" suffix=" USD" @complete="completed++" />
    <p><rumo-button @click="value += 1234.56">Update value</rumo-button> <rumo-button @click="show = !show">Mount / destroy</rumo-button></p>
    <p>Completions: {{ completed }}</p>
  </div>
</template>
<script>
export default {
  data() { return { value: 12345.67, completed: 0, show: true }; }
};
</script>
```

:::

### Attributes

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| start | Initial value | number | 0 |
| value | Target value; replays from start when changed | number | 0 |
| duration | Duration in seconds | number | 2 |
| decimals | Decimal places | number | 0 |
| separator | Thousands separator; empty string disables grouping | string | , |
| prefix / suffix | Prefix / suffix | string | empty |

### Event

| Event | Description |
| --- | --- |
| complete | Current count finished; canceled counts do not emit |

The target value appears immediately when reduced motion is enabled.
