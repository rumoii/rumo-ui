<template>
  <button class="rumo-button"
    ref="core"
    @click="handleClick"
    :disabled="buttonDisabled"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'rumo-button--' + type : '',
      buttonSize ? 'rumo-button--' + buttonSize : '',
      variant ? 'rumo-button--variant-' + variant : '',
      buttonIconOnly ? 'is-icon-only' : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-dashed': dashed,
        'is-circle': circle,
        'is-text': text,
        'is-clicked': clicked,
        'is-round': round,
        'is-noborder': nobord
      }
    ]">
    <i class="rumo-icons icon-load-linear rumo-icons-spin"
      v-if="loading"
      @click="handleInnerClick"></i>
    <i class="rumo-icons"
      :class="icon"
      v-if="icon && !loading"
      @click="handleInnerClick"></i>
    <span v-if="$slots.default"
      @click="handleInnerClick">
      <slot></slot>
    </span>
  </button>
</template>
<script>
import { clearTimeout } from 'timers';

export default {
  name: 'RumoButton',

  inject: {
    rumoForm: {
      default: ''
    },
    rumoFormItem: {
      default: ''
    }
  },
  data() {
    return {
      clicked: this.click
    };
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    variant: {
      type: String,
      default: ''
    },
    status: String,
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    text: Boolean,
    circle: Boolean,
    dashed: Boolean,
    click: {
      type: Boolean,
      default: false
    },
    nobord: Boolean,
    iconOnly: {
      type: Boolean,
      default: false
    },
    autofocus: Boolean,
    round: Boolean
  },
  computed: {
    _rumoFormItemSize() {
      return (this.rumoFormItem || {}).rumoFormItemSize;
    },
    _buttionText() {
      return !!this.icon && !this.$slots.default;
    },
    buttonSize() {
      return this.size || this._rumoFormItemSize || (this.$RUMO || {}).size;
    },
    buttonDisabled() {
      return this.disabled || (this.rumoForm || {}).disabled;
    },
    buttonIconOnly() {
      return this.iconOnly || this._buttionText;
    },
    buttonClicked() {
      return this.clicked;
    },
  },

  methods: {
    handleClick(evt) {
      this.clicked = true;
      setTimeout(() => {
        this.clicked = !this.clicked;
      }, 300);
      this.$emit('click', evt);
    },
    handleInnerClick(evt) {
      if (this.disabled) {
        evt.stopPropagation();
      }
    }
  }
};
</script>
