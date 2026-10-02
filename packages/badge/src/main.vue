<template>
  <div class="rumo-badge">
    <slot></slot>
    <transition name="rumo-zoom-in-center">
      <sup v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="rumo-badge__content"
        :class="[
          'rumo-badge__content--' + type,
          size ? 'rumo-badge__content--' + size : '',
          variant ? 'rumo-badge__content--variant-' + variant : '',
          { 'is-fixed': $slots.default, 'is-dot': isDot }]">
      </sup>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'RumoBadge',

  props: {
    value: {},
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      validator(val) {
        return ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1;
      }
    },
    /** Dash 皮肤:徽标尺寸,设置 sm 时使用紧凑视觉 */
    size: {
      type: String,
      default: ''
    },
    /** Dash 皮肤:视觉变体,设置后覆盖 type 外观 */
    variant: {
      type: String,
      default: ''
    }
  },

  computed: {
    content() {
      if (this.isDot) return;

      const value = this.value;
      const max = this.max;

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
      }

      return value;
    }
  }
};
</script>
