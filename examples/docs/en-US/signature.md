## Signature

Draw with a mouse or touch input. Save a PNG, undo or clear through the component ref.

:::demo

```html
<template>
  <div>
    <rumo-signature ref="signature" :width="360" :height="160" pen-color="#856AF9"
      @onBegin="drawing = true" @onEnd="drawing = false" />
    <p>
      <rumo-button @click="$refs.signature.undo()">Undo</rumo-button>
      <rumo-button @click="$refs.signature.clear()">Clear</rumo-button>
      <rumo-button @click="save">Export PNG</rumo-button>
    </p>
    <p>Drawing: {{ drawing ? 'yes' : 'no' }}</p>
    <img v-if="image" :src="image" alt="Exported signature" style="max-width: 360px">
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

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| penColor | Stroke color | string | #000000 |
| bgColor | PNG background | string | transparent |
| width / height | Display size | number / string | 300 / 150 |
| dotSize | Dot size; 0 uses the engine default | number | 0 |

### Methods and events

| Name | Description |
| --- | --- |
| save() | Returns a PNG dataURL |
| clear() / undo() | Clear / undo the last stroke |
| onBegin / onEnd | Stroke begins / ends |
