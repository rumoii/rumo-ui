## Countup 数字滚动

从起始值滚动到 `value`。更新 `value` 会重新播放，动画完成时触发 `complete`。

:::demo

```html
<template>
  <div>
    <rumo-countup v-if="show" :start="0" :value="value" :duration="1.2" :decimals="2" separator="," prefix="¥" suffix=" 元" @complete="completed++" />
    <p><rumo-button @click="value += 1234.56">更新数值</rumo-button> <rumo-button @click="show = !show">挂载 / 销毁</rumo-button></p>
    <p>完成次数：{{ completed }}</p>
  </div>
</template>
<script>
export default {
  data() { return { value: 12345.67, completed: 0, show: true }; }
};
</script>
```

:::

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| start | 起始值 | number | 0 |
| value | 目标值；变化时从 start 重播 | number | 0 |
| duration | 时长，秒 | number | 2 |
| decimals | 小数位数 | number | 0 |
| separator | 千分位分隔符；空字符串禁用分组 | string | , |
| prefix / suffix | 前缀 / 后缀 | string | 空字符串 |

### 事件

| 事件 | 说明 |
| --- | --- |
| complete | 当前计数完成；销毁或重播取消的旧计数不触发 |

启用系统「减少动态效果」时直接显示目标值。
