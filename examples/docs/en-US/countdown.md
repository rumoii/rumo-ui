## Countdown

The target is a millisecond timestamp. `finish` fires once at zero and the timer stops.

:::demo

```html
<template><div><rumo-button @click="restart">Restart</rumo-button>
  <rumo-countdown title="Time left" :value="target" format="mm:ss" @finish="finished = true" />
  <span v-if="finished">Finished</span></div></template>
<script>export default { data() { return { target: Date.now() + 10000, finished: false }; },
  methods: { restart() { this.target = Date.now() + 10000; this.finished = false; } } };</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Target timestamp or date-like object | number / object | 0 |
| format | Y/M/D/H/m/s/S format pattern | string | HH:mm:ss |
| title / prefix / suffix | Heading / prefix / suffix | string | — |
| valueStyle | Value style | string / object | — |

### Events / Slots

| Name | Description |
| --- | --- |
| change | Remaining milliseconds changed |
| finish | Fires once at zero |
| title / prefix / suffix | Custom content |
