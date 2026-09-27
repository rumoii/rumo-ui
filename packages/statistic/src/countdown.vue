<template>
  <rumo-statistic class="rumo-countdown" :value="remaining" :formatter="formatValue" :title="title"
    :prefix="prefix" :suffix="suffix" :value-style="valueStyle">
    <template v-if="$slots.title" slot="title"><slot name="title"></slot></template>
    <template v-if="$slots.prefix" slot="prefix"><slot name="prefix"></slot></template>
    <template v-if="$slots.suffix" slot="suffix"><slot name="suffix"></slot></template>
  </rumo-statistic>
</template>
<script>
// Derived from element-plus/packages/components/countdown/src/{countdown.vue,countdown.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import Statistic from './main';
import { getTime, formatTime } from './countdown-utils';
export default {
  name: 'RumoCountdown', components: { RumoStatistic: Statistic },
  props: { value: { type: [Number, Object], default: 0 }, format: { type: String, default: 'HH:mm:ss' },
    title: String, prefix: String, suffix: String, valueStyle: [String, Object, Array] },
  data() { return { remaining: 0 }; },
  computed: { displayValue() { return formatTime(this.remaining, this.format); } },
  watch: { value() { this.start(); } },
  mounted() { this.start(); },
  beforeDestroy() { this.disposed = true; this.stop(); },
  methods: {
    formatValue(value) { return formatTime(value, this.format); },
    stop() { if (this.timer !== undefined) { cancelAnimationFrame(this.timer); this.timer = undefined; } },
    start() {
      this.stop();
      const target = getTime(this.value);
      if (!isFinite(target)) { this.remaining = 0; return; }
      const tick = () => {
        if (this.disposed) return;
        const diff = target - Date.now();
        this.remaining = Math.max(0, diff);
        this.$emit('change', this.remaining);
        if (diff <= 0) { this.timer = undefined; this.$emit('finish'); return; }
        this.timer = requestAnimationFrame(tick);
      };
      this.timer = requestAnimationFrame(tick);
    }
  }
};
</script>
