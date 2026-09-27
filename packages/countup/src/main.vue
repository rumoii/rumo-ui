<template>
  <span ref="number" class="rumo-countup" />
</template>
<script>
// Uses countup.js@2.10.1 (MIT) — https://github.com/inorganik/countUp.js
import { CountUp } from 'countup.js';

export default {
  name: 'RumoCountup',
  props: {
    start: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    duration: { type: Number, default: 2 },
    decimals: { type: Number, default: 0 },
    separator: { type: String, default: ',' },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' }
  },
  watch: {
    start: 'restart', value: 'restart', duration: 'restart', decimals: 'restart',
    separator: 'restart', prefix: 'restart', suffix: 'restart'
  },
  mounted() {
    this.motionMedia = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    this.motionHandler = () => this.restart();
    if (this.motionMedia) {
      if (this.motionMedia.addEventListener) this.motionMedia.addEventListener('change', this.motionHandler);
      else if (this.motionMedia.addListener) this.motionMedia.addListener(this.motionHandler);
    }
    this.restart();
  },
  beforeDestroy() {
    this.stop();
    if (this.motionMedia) {
      if (this.motionMedia.removeEventListener) this.motionMedia.removeEventListener('change', this.motionHandler);
      else if (this.motionMedia.removeListener) this.motionMedia.removeListener(this.motionHandler);
    }
    this.motionMedia = null;
    this.motionHandler = null;
  },
  methods: {
    stop() {
      this.runToken = (this.runToken || 0) + 1;
      if (this.counter) this.counter.onDestroy();
      this.counter = null;
    },
    restart() {
      this.stop();
      if (!this.$refs.number) return;
      const token = this.runToken;
      const reduced = this.motionMedia && this.motionMedia.matches;
      this.counter = new CountUp(this.$refs.number, this.value, {
        startVal: this.start,
        duration: Math.max(0, this.duration),
        decimalPlaces: Math.max(0, Math.floor(this.decimals)),
        separator: this.separator,
        prefix: this.prefix,
        suffix: this.suffix,
        onCompleteCallback: () => {
          if (token === this.runToken) this.$emit('complete');
        }
      });
      if (this.counter.error) return;
      if (reduced || this.duration <= 0) {
        this.counter.printValue(this.value);
        this.$emit('complete');
      } else {
        this.counter.start();
      }
    }
  }
};
</script>
