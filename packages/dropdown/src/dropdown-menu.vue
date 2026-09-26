<template>
  <transition name="rumo-zoom-in-top"
    @after-leave="doDestroy">
    <ul class="rumo-dropdown-menu rumo-popper"
      :class="[size && `rumo-dropdown-menu--${size}`]"
      v-show="showPopper">
      <slot></slot>
    </ul>
  </transition>
</template>
<script>
import Popper from 'rumo-ui/src/utils/vue-popper';

export default {
  name: 'RumoDropdownMenu',

  componentName: 'RumoDropdownMenu',

  mixins: [Popper],

  props: {
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      size: this.dropdown.dropdownSize
    };
  },

  inject: ['dropdown'],

  created() {
    this.$on('updatePopper', () => {
      if (this.showPopper) this.updatePopper();
    });
    this.$on('visible', val => {
      this.showPopper = val;
    });
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
    this.dropdown.initDomOperation();
  },

  watch: {
    'dropdown.placement': {
      immediate: true,
      handler(val) {
        this.currentPlacement = val;
      }
    }
  }
};
</script>
