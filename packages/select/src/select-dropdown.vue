<template>
  <div class="rumo-select-dropdown rumo-popper"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass, $RUMO.namespaceClass]"
    :style="{ minWidth: minWidth, margin: popoverMargin }">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
import Popper from 'rumo-ui/src/utils/vue-popper';

export default {
  name: 'RumoSelectDropdown',

  componentName: 'RumoSelectDropdown',

  mixins: [Popper],

  props: {
    placement: {
      default: 'bottom-start'
    },

    boundariesPadding: {
      default: 0
    },

    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },

    visibleArrow: {
      default: false
    },

    appendToBody: {
      type: Boolean,
      default: true
    },

    popoverMargin: {
      type: String,
      default: '12px 0'
    }
  },

  data() {
    return {
      minWidth: ''
    };
  },

  computed: {
    popperClass() {
      return this.$parent.popperClass;
    }
  },

  watch: {
    '$parent.inputWidth'() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
    }
  },

  mounted() {
    this.referenceElm = this.$parent.$refs.reference.$el;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on('updatePopper', () => {
      if (this.$parent.visible) this.updatePopper();
    });
    this.$on('destroyPopper', this.destroyPopper);
  }
};
</script>
