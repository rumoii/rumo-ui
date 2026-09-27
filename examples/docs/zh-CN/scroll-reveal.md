## ScrollReveal 滚动显现

滚动到视口内时显现元素。全量安装自动注册 `v-scroll-reveal`，按需使用时调用 `Vue.use(ScrollReveal)`。

:::demo

```html
<template>
  <div>
    <rumo-button @click="show = !show">挂载 / 销毁</rumo-button>
    <p>向下滚动查看五种效果；反向滚动可检查重复显现。</p>
    <div v-if="show">
      <div v-for="effect in effects" :key="effect" v-scroll-reveal="{ effect: effect, once: once, delay: 150, offset: 80 }" style="margin: 180px 0; padding: 24px; background: #f2f1ff">{{ effect }}</div>
    </div>
    <rumo-button @click="once = !once">once: {{ once }}</rumo-button>
  </div>
</template>
<script>
export default {
  data() { return { show: true, once: false, effects: ['fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in'] }; }
};
</script>
```

:::

### 指令参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| effect | fade-up / fade-down / fade-left / fade-right / zoom-in | string | fade-up |
| once | 首次显现后保持可见 | boolean | false |
| delay | 显现延迟，毫秒 | number | 0 |
| offset | 元素距视口底部的触发距离，像素 | number | 120 |

指令值也可直接写效果名，例如 `v-scroll-reveal="'zoom-in'"`。不支持 IntersectionObserver 或启用系统「减少动态效果」时直接显示。
