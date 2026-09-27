## Countdown 倒计时

目标时间为毫秒时间戳；到点触发一次 `finish` 并停止计时。

:::demo

```html
<template><div><rumo-button @click="restart">重新开始</rumo-button>
  <rumo-countdown title="剩余时间" :value="target" format="mm:ss" @finish="finished = true" />
  <span v-if="finished">已结束</span></div></template>
<script>export default { data() { return { target: Date.now() + 10000, finished: false }; },
  methods: { restart() { this.target = Date.now() + 10000; this.finished = false; } } };</script>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 目标时间戳或有 valueOf 的日期对象 | number / object | 0 |
| format | Y/M/D/H/m/s/S 格式模板 | string | HH:mm:ss |
| title / prefix / suffix | 标题 / 前缀 / 后缀 | string | — |
| valueStyle | 数值样式 | string / object | — |

### Events / Slots

| 名称 | 说明 |
| --- | --- |
| change | 剩余毫秒数变化 |
| finish | 到点触发一次 |
| title / prefix / suffix | 自定义对应内容 |
