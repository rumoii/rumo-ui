<template>
  <div class="rumo-tabs__active-bar"
    :class="`is-${ rootTabs.tabPosition }`"
    :style="barStyle"></div>
</template>
<script>
export default {
  name: 'TabBar',

  props: {
    tabs: Array
  },

  inject: ['rootTabs'],

  computed: {
    barStyle: {
      cache: false,
      get() {
        let style = {};
        let offset = 0;
        let tabSize = 0;
        const sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
        const sizeDir = sizeName === 'width' ? 'x' : 'y';
        const firstUpperCase = str => {
          return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
        };
        this.tabs.every((tab, index) => {
          let $el = this.$parent.$refs.tabs[index];
          if (!$el) { return false; }

          if (!tab.active) {
            offset += $el[`client${firstUpperCase(sizeName)}`];
            return true;
          } else {
            tabSize = $el[`client${firstUpperCase(sizeName)}`];
            if (sizeName === 'width') {
              tabSize -= 32;
            }
            if (sizeName === 'height') {
              tabSize -= 16;
            }
            return false;
          }
        });

        if (sizeName === 'width') {
          offset += 16;
        }
        if (sizeName === 'height') {
          offset += 16;
        }
        const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`;
        style[sizeName] = tabSize + 'px';
        style.transform = transform;
        style.msTransform = transform;
        style.webkitTransform = transform;

        return style;
      }
    }
  }
};
</script>
