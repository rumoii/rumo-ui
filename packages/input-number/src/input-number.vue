<template>
  <div class="rumo-input-number"
    :class="[
      inputNumberSize ? 'rumo-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]">
    <span v-if="controls"
      class="rumo-input-number__decrease"
      :class="{'is-disabled': minDisabled}"
      v-repeat-click="decrease"
      @keydown.enter="decrease"
      role="button">
      <i :class="`rumo-icons icon-${controlsAtRight ? 'down-line' : 'delete'}`"></i>
    </span>
    <span v-if="controls"
      class="rumo-input-number__increase"
      :class="{'is-disabled': maxDisabled}"
      v-repeat-click="increase"
      @keydown.enter="increase"
      role="button">
      <i :class="`rumo-icons icon-${controlsAtRight ? 'up-line' : 'add'}`"></i>
    </span>
    <rumo-input :value="displayValue"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="handleInputChange"
      @input="handleInput"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :placeholder="placeholder"
      ref="input"
      :label="label">
      <template slot="prepend"
        v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append"
        v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </rumo-input>
  </div>
</template>
<script>
import RumoInput from 'rumo-ui/packages/input';
import Focus from 'rumo-ui/src/mixins/focus';
import RepeatClick from 'rumo-ui/src/directives/repeat-click';

export default {
  name: 'RumoInputNumber',
  mixins: [Focus('input')],
  inject: {
    rumoForm: {
      default: ''
    },
    rumoFormItem: {
      default: ''
    }
  },
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    RumoInput
  },
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    integer: {
      type: [Boolean, String],
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {
      default: 0
    },
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val);
      }
    }
  },
  data() {
    return {
      currentValue: 0,
      userInput: null
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        let newVal = Number(value);
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return;
          }

          if (this.stepStrictly) {
            const stepPrecision = this.getPrecision(this.step);
            const precisionFactor = Math.pow(10, stepPrecision);
            newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor;
          }

          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision);
          }
        }
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        this.currentValue = newVal;
        this.userInput = null;
        this.$emit('input', newVal);
      }
    }
  },
  computed: {
    minDisabled() {
      return this._decrease(this.value, this.step) < this.min;
    },
    maxDisabled() {
      return this._increase(this.value, this.step) > this.max;
    },
    numPrecision() {
      const { value, step, getPrecision } = this;
      return Math.max(getPrecision(value), getPrecision(step));
    },
    controlsAtRight() {
      return this.controlsPosition === 'right';
    },
    _rumoFormItemSize() {
      return (this.rumoFormItem || {}).rumoFormItemSize;
    },
    inputNumberSize() {
      return this.size || this._rumoFormItemSize || (this.$RUMO || {}).size;
    },
    inputNumberDisabled() {
      return this.disabled || (this.rumoForm || {}).disabled;
    },
    displayValue() {
      if (this.userInput !== null) {
        return this.userInput;
      }

      let currentValue = this.currentValue;

      if (typeof currentValue === 'number') {
        if (this.stepStrictly) {
          const stepPrecision = this.getPrecision(this.step);
          const precisionFactor = Math.pow(10, stepPrecision);
          currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor;
        }

        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision);
        }
      }

      return currentValue;
    }
  },
  methods: {
    toPrecision(num, precision) {
      if (precision === undefined) precision = this.numPrecision;
      return parseFloat(parseFloat(Number(num).toFixed(precision)));
    },
    getPrecision(value) {
      const valueString = value.toString();
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    _increase(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;

      const precisionFactor = Math.pow(10, this.numPrecision);

      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },
    _decrease(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;

      const precisionFactor = Math.pow(10, this.numPrecision);

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },
    // 新增取整设置，支持`true(floor)`、`false`、`floor`、`ceil`、 `round`，默认为 `false` @alpar.wen
    _integer(value) {
      if (this.integer === false || this.integer === 'false') {
        return value;
      } else if (~['floor', 'ceil', 'round'].indexOf(this.integer)) {
        return Math[this.integer](value);
        // } else if (this.integer === 'true' || this.integer === true) {
        //   return Math.floor(value);
      } else {
        return Math.floor(value);
      }
    },
    increase() {
      if (this.inputNumberDisabled || this.maxDisabled) return;
      const value = this.value || 0;
      const newVal = this._increase(value, this.step);
      if (newVal > this.max) return;
      this.setCurrentValue(newVal);
    },
    decrease() {
      if (this.inputNumberDisabled || this.minDisabled) return;
      const value = this.value || 0;
      const newVal = this._decrease(value, this.step);
      if (newVal < this.min) return;
      this.setCurrentValue(newVal);
    },
    handleBlur(event) {
      this.$emit('blur', event);
      this.$refs.input.setCurrentValue(this.currentValue);
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    setCurrentValue(newVal) {
      const oldVal = this.currentValue;
      newVal = this._integer(newVal);
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      if (oldVal === newVal) {
        this.$refs.input.setCurrentValue(this.currentValue);
        return;
      }
      this.userInput = null;
      this.$emit('input', newVal);
      this.$emit('change', newVal, oldVal);
      this.currentValue = newVal;
    },
    handleInput(value) {
      this.userInput = value;
    },
    handleInputChange(value) {
      const newVal = Number(value);
      if (!isNaN(newVal)) {
        this.setCurrentValue(newVal);
      }
      this.userInput = null;
    }
  },
  mounted() {
    let innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('role', 'spinbutton');
    innerInput.setAttribute('aria-valuemax', this.max);
    innerInput.setAttribute('aria-valuemin', this.min);
    innerInput.setAttribute('aria-valuenow', this.currentValue);
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
  },
  updated() {
    if (!this.$refs || !this.$refs.input) return;
    const innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('aria-valuenow', this.currentValue);
  }
};
</script>
