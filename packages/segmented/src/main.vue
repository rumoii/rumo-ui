<template>
  <div class="rumo-segmented" :class="segmentedClass" role="radiogroup" :aria-label="ariaLabel || 'segmented'">
    <div class="rumo-segmented__group">
      <div class="rumo-segmented__item-selected" :style="selectedStyle"></div>
      <label v-for="(option, index) in options" :key="index" class="rumo-segmented__item"
        :class="{ 'is-selected': optionValue(option) === value, 'is-disabled': optionDisabled(option) }">
        <input class="rumo-segmented__item-input" type="radio" :name="radioName"
          :value="optionValue(option)" :checked="optionValue(option) === value"
          :disabled="optionDisabled(option)" @change="select(option)">
        <span class="rumo-segmented__item-label"><slot :item="option">{{ optionLabel(option) }}</slot></span>
      </label>
    </div>
  </div>
</template>

<script>
// Derived from element-plus/packages/components/segmented/src/{segmented.vue,segmented.ts,types.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import { addResizeListener, removeResizeListener } from 'rumo-ui/src/utils/resize-event';
import Emitter from 'rumo-ui/src/mixins/emitter';

let nextName = 0;
export default {
  name: 'RumoSegmented', componentName: 'RumoSegmented', mixins: [Emitter],
  inject: { rumoForm: { default: null } },
  props: {
    value: [String, Number, Boolean], options: { type: Array, default: () => [] },
    props: { type: Object, default: () => ({}) }, direction: { type: String, default: 'horizontal' },
    block: Boolean, size: String, disabled: Boolean, validateEvent: { type: Boolean, default: true },
    name: String, ariaLabel: String
  },
  data() { return { radioName: this.name || 'rumo-segmented-' + ++nextName, width: 0, height: 0, x: 0, y: 0, ready: false }; },
  computed: {
    segmentedClass() {
      const size = this.size || (this.rumoForm && this.rumoForm.size) || (this.$RUMO && this.$RUMO.size);
      return [size && 'rumo-segmented--' + size, 'rumo-segmented--' + this.direction, { 'is-block': this.block }];
    },
    selectedStyle() {
      return { width: this.direction === 'vertical' ? '100%' : this.width + 'px',
        height: this.direction === 'vertical' ? this.height + 'px' : '100%',
        transform: this.direction === 'vertical' ? 'translateY(' + this.y + 'px)' : 'translateX(' + this.x + 'px)',
        display: this.ready ? '' : 'none' };
    }
  },
  watch: {
    value() { this.queueMeasure(); }, options: { handler() { this.queueMeasure(); }, deep: true },
    direction() { this.queueMeasure(); }, name(value) { if (value) this.radioName = value; }
  },
  mounted() { this.queueMeasure(); addResizeListener(this.$el, this.queueMeasure); },
  beforeDestroy() { removeResizeListener(this.$el, this.queueMeasure); },
  methods: {
    optionValue(option) { return option !== null && typeof option === 'object' ? option[this.props.value || 'value'] : option; },
    optionLabel(option) { return option !== null && typeof option === 'object' ? option[this.props.label || 'label'] : option; },
    optionDisabled(option) { return this.disabled || !!(this.rumoForm && this.rumoForm.disabled) || !!(option && typeof option === 'object' && option[this.props.disabled || 'disabled']); },
    select(option) {
      if (this.optionDisabled(option)) return;
      const next = this.optionValue(option);
      if (next === this.value) return;
      this.$emit('input', next); this.$emit('change', next);
      if (this.validateEvent) this.dispatch('RumoFormItem', 'rumo.form.change', [next]);
    },
    queueMeasure() { this.$nextTick(this.measure); },
    measure() {
      if (!this.$el) return;
      const selected = this.$el.querySelector('.rumo-segmented__item.is-selected');
      this.ready = !!selected;
      if (!selected) return;
      this.width = selected.offsetWidth; this.height = selected.offsetHeight;
      this.x = selected.offsetLeft; this.y = selected.offsetTop;
    }
  }
};
</script>
