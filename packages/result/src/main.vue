<template>
  <div class="rumo-result">
    <div class="rumo-result__icon">
      <slot name="icon">
        <rumo-icon
          v-if="iconName"
          :name="iconName"
          :class="'is-' + icon"
        ></rumo-icon>
      </slot>
    </div>
    <div v-if="title || $slots.title" class="rumo-result__title">
      <slot name="title">
        <p>{{ title }}</p>
      </slot>
    </div>
    <div v-if="subTitle || $slots['sub-title']" class="rumo-result__subtitle">
      <slot name="sub-title">
        <p>{{ subTitle }}</p>
      </slot>
    </div>
    <div v-if="$slots.extra" class="rumo-result__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
// Derived from element-plus/packages/components/result/src/{result.vue,result.ts} (MIT) — https://github.com/element-plus/element-plus
// Icon mapping adapted: EP SVG filled icons -> rumo-icons font classes
import RumoIcon from 'rumo-ui/packages/icon';

const ICON_MAP = {
  primary: 'info-fill',
  success: 'check-fill',
  warning: 'warning-fill',
  error: 'close-fill',
  info: 'info-fill'
};

export default {
  name: 'RumoResult',

  components: {
    RumoIcon
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'info',
      validator: val => ['primary', 'success', 'warning', 'info', 'error'].indexOf(val) > -1
    }
  },

  computed: {
    iconName() {
      return ICON_MAP[this.icon] || ICON_MAP.info;
    }
  }
};
</script>
