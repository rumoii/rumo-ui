<template>
  <i class="rumo-icons"
    :class="[nameClass, spinClass, rotateClass, flipClass, sizeClass]">
  </i>
</template>
<script>
import Vue from 'vue';
export default {
  name: 'RumoIcon',
  props: {
    name: String,
    spin: {
      type: Boolean,
      default: false
    },
    rotate: {
      type: [String, Number],
      validator(val) {
        if (val || val !== '0') {
          if ([0, 90, 180, 270].indexOf(Number.parseInt(val)) >= 0) {
            return true;
          }
          Vue.util.warn('Invalid prop: 参数 "rotate" 必须为 "90" 、 "180" 、 "270"');
          return false;
        }
        return null;
      }
    },
    flip: {
      type: String,
      validator(val) {
        if (val) {
          if (['horizontal', 'vertical'].indexOf(val) >= 0) {
            return true;
          }
          Vue.util.warn('Invalid prop: 参数 "flip" 必须为 "horizontal" 或 "vertical"');
          return false;
        }
        return null;
      }
    },
    size: {
      type: [String, Number],
      validator(val) {
        if (val) {
          if ([14, 18, 24, 36, 48].indexOf(Number.parseInt(val)) >= 0) {
            return true;
          }
          Vue.util.warn('Invalid prop: 参数 "size" 必须为 "14" 、 "18" 、 "24"、 "36"、 "48"');
          return false;
        }
        return null;
      }
    }
  },
  computed: {
    nameClass() {
      return this.name ? 'icon-' + this.name : '';
    },
    spinClass() {
      return this.spin ? 'rumo-icons-spin' : '';
    },
    rotateClass() {
      return this.rotate && Number.parseInt(this.rotate) > 0 ? 'rumo-icons-rotate-' + Number.parseInt(this.rotate) : '';
    },
    flipClass() {
      return this.flip ? 'rumo-icons-flip-' + this.flip : '';
    },
    sizeClass() {
      return this.size ? 'rumo-icons-' + this.size : '';
    }
  }
};
</script>
