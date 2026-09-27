## Signature 手写签名

支持鼠标和触摸绘制。通过组件引用保存 PNG、撤销或清空。

:::demo

```html
<template>
  <div>
    <rumo-signature ref="signature" :width="360" :height="160" pen-color="#856AF9"
      @onBegin="drawing = true" @onEnd="drawing = false" />
    <p>
      <rumo-button @click="$refs.signature.undo()">撤销</rumo-button>
      <rumo-button @click="$refs.signature.clear()">清空</rumo-button>
      <rumo-button @click="save">导出 PNG</rumo-button>
    </p>
    <p>绘制中：{{ drawing ? '是' : '否' }}</p>
    <img v-if="image" :src="image" alt="导出的签名" style="max-width: 360px">
  </div>
</template>
<script>
export default {
  data() { return { image: '', drawing: false }; },
  methods: { save() { this.image = this.$refs.signature.save(); } }
};
</script>
```

:::

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| penColor | 画笔颜色 | string | #000000 |
| bgColor | PNG 背景颜色 | string | 透明 |
| width / height | 画布显示尺寸 | number / string | 300 / 150 |
| dotSize | 点尺寸，0 使用引擎默认 | number | 0 |

### 方法与事件

| 名称 | 说明 |
| --- | --- |
| save() | 返回 PNG dataURL |
| clear() / undo() | 清空 / 撤销最后一笔 |
| onBegin / onEnd | 开始 / 结束一笔 |
