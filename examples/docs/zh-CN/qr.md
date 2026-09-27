## Qr 二维码

文本和参数更新后会自动重绘。logo 使用图片地址，跨域图片需允许 CORS 才能导出 PNG；带 logo 时建议选 H 纠错级别。

:::demo

```html
<template>
  <div>
    <rumo-input v-model="text" style="width: 260px" />
    <select v-model="ecLevel"><option>L</option><option>M</option><option>Q</option><option>H</option></select>
    <rumo-button @click="purple = !purple">切换颜色</rumo-button>
    <rumo-button @click="showLogo = !showLogo">切换 logo</rumo-button>
    <div><rumo-qr :text="text" :size="200" :ec-level="ecLevel"
      :color="purple ? { dark: '#856AF9', light: '#ffffff' } : { dark: '#000000', light: '#ffffff' }"
      :logo="showLogo ? logo : ''" @load="onLoad" @error="onError" /></div>
    <p>{{ status }}</p>
  </div>
</template>
<script>
export default {
  data() { return { text: 'https://example.com', ecLevel: 'H', purple: false, showLogo: false, logo: '', status: '' }; },
  mounted() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 40;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#856AF9'; ctx.fillRect(0, 0, 40, 40);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px sans-serif'; ctx.fillText('R', 10, 30);
    this.logo = canvas.toDataURL('image/png');
  },
  methods: {
    onLoad(dataUrl) { this.status = 'PNG 已生成：' + dataUrl.length + ' 字符'; },
    onError(error) { this.status = error.message; }
  }
};
</script>
```

:::

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 编码文本 | string | 空字符串 |
| size | 正方形宽高（px） | number | 200 |
| margin | 空白边宽度（模块数） | number | 4 |
| ecLevel | 纠错级别 L/M/Q/H | string | M |
| color | dark/light 颜色对象 | object | 黑/白 |
| logo | 居中叠绘的图片地址 | string | 空字符串 |

### 事件

| 事件 | 说明 |
| --- | --- |
| load | 绘制完成，参数为 PNG dataURL |
| error | 绘制或 logo 加载失败，参数为 Error |
