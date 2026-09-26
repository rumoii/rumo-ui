<template>
  <div>
    <div ref="point"
      :class="classes"
      :style="styles">
      <slot></slot>
    </div>
    <div v-show="slot"
      :style="slotStyle"></div>
  </div>
</template>
<script>
import { on, off } from 'rumo-ui/src/utils/dom';

export default {
  name: 'RumoAffix',
  props: {
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetBottom: {
      type: Number
    }
  },
  data() {
    return {
      offsetParent: () => { this.$el.offsetParent; },
      affix: false,
      styles: {},
      slot: false,
      slotStyle: {}
    };
  },
  computed: {
    offsetType() {
      let type = 'top';
      if (this.offsetBottom >= 0) {
        type = 'bottom';
      }
      return type;
    },
    classes() {
      return [
        {
          ['rumo-affix']: this.affix
        }
      ];
    }
  },
  mounted() {
    const elOffsetParent = this.$el.offsetParent;
    const elClassList = elOffsetParent.classList;
    // console.log(elClassList, elClassList.contains('rumo-scrollbar'), elClassList.contains('rumo-scrollbar__view'));

    if (elClassList.contains('rumo-scrollbar')) { // 父级是否绑定 rumo-scrollbar
      this.offsetParent = elOffsetParent.firstChild;
      // this.offsetParent = elOffsetParent.querySelector('.rumo-scrollbar__wrap');
    } else if (elClassList.contains('rumo-scrollbar__view')) { // 重载页面 rumo-scrollbar__view 被设置为 position:relative;
      this.offsetParent = elOffsetParent.parentNode;
    } else {
      this.offsetParent = elOffsetParent;
    }

    on(window, 'scroll', this.handleScroll);
    on(window, 'resize', this.handleScroll);
    on(this.offsetParent, 'scroll', this.handleScroll);
  },
  beforeDestroy() {
    off(this.offsetParent, 'scroll', this.handleScroll);
    off(window, 'scroll', this.handleScroll);
    off(window, 'resize', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const affix = this.affix;
      const scrollTop = this.getScroll(window, true);
      const elOffset = this.getOffset(this.$el);
      const windowHeight = window.innerHeight;
      const elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;
      // console.log(elOffset);

      // Fixed Top
      if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType === 'top' && !affix) {
        this.affix = true;
        this.slotStyle = {
          width: this.$refs.point.clientWidth + 'px',
          height: this.$refs.point.clientHeight + 'px'
        };
        this.slot = true;
        this.styles = {
          top: `${this.offsetTop}px`,
          left: `${elOffset.left}px`,
          width: `${this.$el.offsetWidth}px`
        };
        this.$emit('on-change', true);
      } else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType === 'top' && affix) {
        this.slot = false;
        this.slotStyle = {};
        this.affix = false;
        this.styles = null;
        this.$emit('on-change', false);
      }
      // Fixed Bottom
      if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType === 'bottom' && !affix) {
        this.affix = true;
        this.styles = {
          bottom: `${this.offsetBottom}px`,
          left: `${elOffset.left}px`,
          width: `${this.$el.offsetWidth}px`
        };
        this.$emit('on-change', true);
      } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType === 'bottom' && affix) {
        this.affix = false;
        this.styles = null;
        this.$emit('on-change', false);
      }
    },
    getScroll(target, top) {
      const prop = top ? 'pageYOffset' : 'pageXOffset';
      const method = top ? 'scrollTop' : 'scrollLeft';
      let ret = target[prop];
      if (typeof ret !== 'number') {
        ret = window.document.documentElement[method];
      }
      return ret;
    },
    getOffset(element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = this.getScroll(window, true);
      const scrollLeft = this.getScroll(window);
      const docEl = window.document.body;
      const clientTop = docEl.clientTop || 0;
      const clientLeft = docEl.clientLeft || 0;
      return {
        top: rect.top + scrollTop - clientTop,
        left: rect.left + scrollLeft - clientLeft
      };
    }
  }
};
</script>