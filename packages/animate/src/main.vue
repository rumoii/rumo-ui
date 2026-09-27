<template>
  <div class="rumo-animate"><slot /></div>
</template>
<script>
// Uses animejs@3.2.2 (MIT) — https://github.com/juliangarnier/anime
import { createAnimation } from './presets';

export default {
  name: 'RumoAnimate',
  props: {
    type: { type: String, default: 'fade-in' },
    effect: { type: String, default: '' },
    duration: { type: Number, default: 600 },
    delay: { type: Number, default: 0 },
    autoplay: { type: Boolean, default: true }
  },
  mounted() {
    this.animation = createAnimation(this.$el);
    if (this.autoplay) this.play();
  },
  beforeDestroy() {
    if (this.animation) this.animation.destroy();
    this.animation = null;
  },
  methods: {
    play() {
      if (!this.animation) return;
      this.animation.play({ effect: this.effect || this.type, duration: this.duration, delay: this.delay });
    }
  }
};
</script>
