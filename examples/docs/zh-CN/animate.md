## Animate 动效

使用 animejs v3 驱动预设动效。`v-animate` 可用于任意元素；`rumo-animate` 提供手动重播方法。全量安装自动注册指令，按需使用时调用 `Vue.use(Animate)`。

:::demo

```html
<template>
  <div>
    <rumo-button @click="effect = 'fade-in-up'; remount()">入场</rumo-button>
    <rumo-button @click="effect = 'pulse'; remount()">强调</rumo-button>
    <rumo-button @click="effect = 'fade-out'; remount()">退场</rumo-button>
    <rumo-button @click="$refs.manual.play()">重播组件</rumo-button>
    <div v-if="show" :key="key" v-animate="{ effect: effect, duration: 500, delay: 150 }" style="padding: 16px; margin: 16px 0; background: #f2f1ff">指令：{{ effect }}</div>
    <rumo-animate ref="manual" type="shake" :autoplay="false" :duration="500" style="padding: 16px; background: #f2f1ff">组件：点击按钮重播</rumo-animate>
  </div>
</template>
<script>
export default {
  data() { return { effect: 'fade-in-up', show: true, key: 0 }; },
  methods: { remount() { this.key++; } }
};
</script>
```

:::

### 指令

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| effect | 入场：fade-in/fade-in-up/fade-in-down/slide-in-left/slide-in-right/zoom-in；强调：pulse/shake/flash；退场：fade-out/fade-out-up/down/left/right | string | fade-in |
| duration | 时长，毫秒 | number | 600 |
| delay | 延迟，毫秒 | number | 0 |
| loop | 循环次数；`true` 为持续循环 | boolean / number | false |

指令值也可直接写预设名，例如 `v-animate="'pulse'"`。

### 组件属性与方法

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type / effect | 预设名；设置 effect 时优先使用 effect | string | fade-in / 空 |
| duration / delay | 时长 / 延迟，毫秒 | number | 600 / 0 |
| autoplay | 挂载时自动播放 | boolean | true |
| play() | 通过组件 ref 手动重播 | method | — |

启用系统「减少动态效果」时直接显示内容并跳过动效。
