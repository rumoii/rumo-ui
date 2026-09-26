<script>
import Emitter from 'rumo-ui/src/mixins/emitter';

export default {
  name: 'RumoCheckboxGroup',

  componentName: 'RumoCheckboxGroup',

  mixins: [Emitter],

  inject: {
    rumoFormItem: {
      default: ''
    }
  },

  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String
  },

  computed: {
    _rumoFormItemSize() {
      return (this.rumoFormItem || {}).rumoFormItemSize;
    },
    checkboxGroupSize() {
      return this.size || this._rumoFormItemSize || (this.$RUMO || {}).size;
    }
  },

  watch: {
    value(value) {
      this.dispatch('RumoFormItem', 'rumo.form.change', [value]);
    }
  }
};
</script>

<template>
  <div class="rumo-checkbox-group"
    role="group"
    aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
