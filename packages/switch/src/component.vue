<template>
  <div class="rumo-switch"
    :class="[
      switchSize ? 'rumo-switch--' + switchSize : '',,
      { 'is-disabled': switchDisabled, 'is-checked': checked }
    ]"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="switchValue">
    <input class="rumo-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue">
    <span :class="['rumo-switch__label', 'rumo-switch__label--left', !checked ? 'is-active' : '']"
      v-show="inLabel"
      v-if="inactiveIconClass || inactiveText">
      <i :class="[inactiveIconClass]"
        v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText"
        :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <span class="rumo-switch__core"
      ref="core">
      <span class="rumo-switch__inner"
        v-show="switchSize != 'mini'"
        v-if="!inLabel && innerText">{{ innerText }}</span>
      <span class="rumo-switch__button"
        :style="{ transform }"
        ref="button"></span>
    </span>
    <span :class="['rumo-switch__label', 'rumo-switch__label--right', checked ? 'is-active' : '']"
      v-show="inLabel"
      v-if="activeIconClass || activeText">
      <i :class="[activeIconClass]"
        v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText"
        :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script>
import Focus from 'rumo-ui/src/mixins/focus';
import Migrating from 'rumo-ui/src/mixins/migrating';

export default {
  name: 'RumoSwitch',
  mixins: [Focus('input'), Migrating],
  inject: {
    rumoForm: {
      default: ''
    },
    rumoFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    inLabel: {
      type: Boolean,
      default: false
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    id: String,
    validateEvent: {
      type: Boolean,
      default: true
    },
    size: String
  },
  data() {
    return {
      coreWidth: this.width
    };
  },
  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue);
    }
  },
  computed: {
    _rumoFormItemSize() {
      return (this.rumoFormItem || {}).rumoFormItemSize;
    },
    checked() {
      return this.value === this.activeValue;
    },
    innerText() {
      return this.checked ? this.activeText : this.inactiveText;
    },
    transform() {
      // return this.checked ? 'translate3d(100%, 0, 0)' : '';
    },
    switchDisabled() {
      return this.disabled || (this.rumoForm || {}).disabled;
    },
    switchSize() {
      return this.size || this._rumoFormItemSize || (this.$RUMO || {}).size;
    }
  },
  watch: {
    checked() {
      this.$refs.input.checked = this.checked;
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
      // if (this.validateEvent) {
      //   this.dispatch('RumoFormItem', 'rumo.form.change', [this.value]);
      // }
    }
  },
  methods: {
    handleChange(event) {
      this.$emit('input', !this.checked ? this.activeValue : this.inactiveValue);
      this.$emit('change', !this.checked ? this.activeValue : this.inactiveValue);
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked;
      });
    },
    setBackgroundColor() {
      let newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    switchValue() {
      !this.switchDisabled && this.handleChange();
    },
    getMigratingConfig() {
      return {
        props: {
          'on-color': 'on-color is renamed to active-color.',
          'off-color': 'off-color is renamed to inactive-color.',
          'on-text': 'on-text is renamed to active-text.',
          'off-text': 'off-text is renamed to inactive-text.',
          'on-value': 'on-value is renamed to active-value.',
          'off-value': 'off-value is renamed to inactive-value.',
          'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
          'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
        }
      };
    }
  },
  mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.$refs.core.offsetWidth || this.width;

    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    this.$refs.input.checked = this.checked;
  }
};
</script>
