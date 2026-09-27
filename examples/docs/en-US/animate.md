## Animate

Preset animations powered by animejs v3. Use `v-animate` on any element or call `play()` on a `rumo-animate` ref. Full installation registers the directive; for local installation, call `Vue.use(Animate)`.

:::demo

```html
<template>
  <div>
    <rumo-button @click="effect = 'fade-in-up'; remount()">Entrance</rumo-button>
    <rumo-button @click="effect = 'pulse'; remount()">Emphasis</rumo-button>
    <rumo-button @click="effect = 'fade-out'; remount()">Exit</rumo-button>
    <rumo-button @click="$refs.manual.play()">Replay component</rumo-button>
    <div v-if="show" :key="key" v-animate="{ effect: effect, duration: 500, delay: 150 }" style="padding: 16px; margin: 16px 0; background: #f2f1ff">Directive: {{ effect }}</div>
    <rumo-animate ref="manual" type="shake" :autoplay="false" :duration="500" style="padding: 16px; background: #f2f1ff">Component: click to replay</rumo-animate>
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

### Directive

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| effect | Entrance: fade-in/fade-in-up/fade-in-down/slide-in-left/slide-in-right/zoom-in; emphasis: pulse/shake/flash; exit: fade-out/fade-out-up/down/left/right | string | fade-in |
| duration | Duration in milliseconds | number | 600 |
| delay | Delay in milliseconds | number | 0 |
| loop | Loop count; `true` loops continuously | boolean / number | false |

The directive also accepts a preset name directly, for example `v-animate="'pulse'"`.

### Component props and method

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type / effect | Preset name; effect takes precedence | string | fade-in / empty |
| duration / delay | Duration / delay in milliseconds | number | 600 / 0 |
| autoplay | Play on mount | boolean | true |
| play() | Replay through a component ref | method | — |

Content appears immediately when reduced motion is enabled.
