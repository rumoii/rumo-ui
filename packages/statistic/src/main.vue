<template>
  <div class="rumo-statistic">
    <div v-if="title || $slots.title" class="rumo-statistic__head"><slot name="title">{{ title }}</slot></div>
    <div class="rumo-statistic__content">
      <span v-if="prefix || $slots.prefix" class="rumo-statistic__prefix"><slot name="prefix">{{ prefix }}</slot></span>
      <span class="rumo-statistic__number" :style="valueStyle">{{ displayValue }}</span>
      <span v-if="suffix || $slots.suffix" class="rumo-statistic__suffix"><slot name="suffix">{{ suffix }}</slot></span>
    </div>
  </div>
</template>
<script>
// Derived from element-plus/packages/components/statistic/src/{statistic.vue,statistic.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
export default {
  name: 'RumoStatistic',
  props: {
    value: { type: [Number, Object], default: 0 }, formatter: Function,
    precision: { type: Number, default: 0 }, decimalSeparator: { type: String, default: '.' },
    groupSeparator: { type: String, default: ',' }, title: String, prefix: String, suffix: String,
    valueStyle: [String, Object, Array]
  },
  computed: {
    displayValue() {
      if (this.formatter) return this.formatter(this.value);
      if (typeof this.value !== 'number' || isNaN(this.value)) return this.value;
      const parts = String(this.value).split('.');
      let decimal = parts[1] || '';
      while (decimal.length < this.precision) decimal += '0';
      decimal = decimal.slice(0, Math.max(0, this.precision));
      const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.groupSeparator);
      return integer + (decimal ? this.decimalSeparator + decimal : '');
    }
  }
};
</script>
