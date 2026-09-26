<template>
  <div class="rumo-rect-checkbox" :class="{ 'is-disabled': isDisabled }">
    <span :class="{ 'rumo-rect-checkbox__label': label }">{{ label }}</span>
    <div
      :style="{ width: width + 'px', height: height + 'px' }"
      :class="['rumo-rect-checkbox__border', { 'is-checked': isChecked }, { 'is-disabled': isDisabled }]"
    >
      <span :class="['rumo-rect-checkbox__inner', { 'is-checked': isChecked }]" />
      <label role="checkbox">
        <input
          class="rumo-rect-checkbox__input"
          :style="{ width: width + 'px', height: height + 'px' }"
          type="checkbox"
          aria-hidden="true"
          v-model="model"
          :disabled="disabled"
          :value="label"
          @change="handleChange"
          @focus="focus = true"
          @blur="focus = false">
        </label>
      <slot />
    </div>
  </div>
</template>

<script>
import Emitter from 'rumo-ui/src/mixins/emitter';

export default {
  name: 'RumoRectCheckbox',
  mixins: [Emitter],
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: [String, Number],
    modelValue: {},
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 160
    },
    height: {
      type: [String, Number],
      default: 96
    }
  },
  computed: {
    model: {
      get() {
        return this.isGroup ? this.store : this.modelValue
      },
      set(val) {
        if (this.isGroup) {
          this.dispatch('RumoCheckboxGroup', 'input', [val])
        } else {
          this.$emit('input', val)
        }
      }
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      }
    },
    isDisabled() {
      return this.isGroup
        ? this._checkboxGroup.disabled || this.disabled : this.disabled
    },
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'RumoCheckboxGroup') {
          parent = parent.$parent
        } else {
          this._checkboxGroup = parent;
          return true
        }
      }
      return false
    },
    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.modelValue;
    },
  },
  methods: {
    handleChange(ev) {
      let checked = !!ev.target.checked
      let value = this.value || typeof this.value === 'number' ? this.value : undefined

      this.$emit('change', checked, value)
      this.$nextTick(() => {
        if (this.isGroup) {
          this.dispatch('RumoCheckboxGroup', 'change', [this._checkboxGroup.value]);
        }
      })
    },
  }
}
</script>
