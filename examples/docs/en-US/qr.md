## Qr

Changing text or options redraws the code. A logo URL must permit CORS for PNG export; use error correction level H with a logo.

:::demo

```html
<template>
  <div>
    <rumo-input v-model="text" style="width: 260px" />
    <select v-model="ecLevel"><option>L</option><option>M</option><option>Q</option><option>H</option></select>
    <rumo-button @click="purple = !purple">Toggle color</rumo-button>
    <rumo-button @click="showLogo = !showLogo">Toggle logo</rumo-button>
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
    onLoad(dataUrl) { this.status = 'PNG generated: ' + dataUrl.length + ' characters'; },
    onError(error) { this.status = error.message; }
  }
};
</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| text | Content to encode | string | empty string |
| size | Square width and height (px) | number | 200 |
| margin | Quiet zone in modules | number | 4 |
| ecLevel | Error correction L/M/Q/H | string | M |
| color | dark/light color object | object | black/white |
| logo | Centered image URL | string | empty string |

### Events

| Event | Description |
| --- | --- |
| load | Render complete; receives PNG dataURL |
| error | Render or logo failure; receives Error |
