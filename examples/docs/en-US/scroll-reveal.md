## ScrollReveal

Reveal elements as they enter the viewport. Full installation registers `v-scroll-reveal`; for local installation, call `Vue.use(ScrollReveal)`.

:::demo

```html
<template>
  <div>
    <rumo-button @click="show = !show">Mount / destroy</rumo-button>
    <p>Scroll down to see five effects, then scroll back to check replay.</p>
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

### Directive options

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| effect | fade-up / fade-down / fade-left / fade-right / zoom-in | string | fade-up |
| once | Remain visible after the first reveal | boolean | false |
| delay | Reveal delay in milliseconds | number | 0 |
| offset | Trigger distance from viewport bottom in pixels | number | 120 |

The directive also accepts an effect name directly, for example `v-scroll-reveal="'zoom-in'"`. Elements appear immediately when IntersectionObserver is unavailable or reduced motion is enabled.
