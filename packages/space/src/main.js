// Derived from element-plus/packages/components/space/src/{space.ts,item.ts,use-space.ts} (MIT) — https://github.com/element-plus/element-plus
const SIZE_MAP = {
  small: 8,
  default: 12,
  large: 16
};

export default {
  name: 'RumoSpace',

  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator: val => ['horizontal', 'vertical'].indexOf(val) > -1
    },
    alignment: {
      type: String,
      default: 'center'
    },
    prefixCls: {
      type: String,
      default: ''
    },
    spacer: {
      type: [String, Number],
      default: null
    },
    wrap: Boolean,
    fill: Boolean,
    fillRatio: {
      type: Number,
      default: 100
    },
    size: {
      type: [String, Array, Number],
      default: 'small'
    }
  },

  computed: {
    sizeValues() {
      const size = this.size;
      let horizontal;
      let vertical;
      if (Array.isArray(size)) {
        horizontal = typeof size[0] === 'number' ? size[0] : 0;
        vertical = typeof size[1] === 'number' ? size[1] : 0;
      } else {
        const val = typeof size === 'number' ? size : (SIZE_MAP[size] || SIZE_MAP.small);
        if ((this.wrap || this.fill) && this.direction === 'horizontal') {
          horizontal = val;
          vertical = val;
        } else if (this.direction === 'horizontal') {
          horizontal = val;
          vertical = 0;
        } else {
          horizontal = 0;
          vertical = val;
        }
      }
      return { horizontal, vertical };
    },
    containerStyle() {
      const style = {
        alignItems: this.alignment,
        rowGap: this.sizeValues.vertical + 'px',
        columnGap: this.sizeValues.horizontal + 'px'
      };
      if (this.wrap || this.fill) {
        style.flexWrap = 'wrap';
      }
      return style;
    },
    itemStyle() {
      const style = {};
      if (this.fill) {
        style.flexGrow = 1;
        style.minWidth = this.fillRatio + '%';
      }
      return style;
    },
    baseCls() {
      return this.prefixCls || 'rumo-space';
    }
  },

  render(h) {
    const raw = this.$slots.default || [];
    const children = [];
    raw.forEach(child => {
      // 跳过注释节点与纯空白文本节点(Vue2 模板编译产物)
      if (!child || child.isComment) return;
      if (child.text !== undefined && !String(child.text).trim()) return;
      children.push(child);
    });
    if (!children.length) return null;

    const items = [];
    const len = children.length;
    children.forEach((child, idx) => {
      items.push(h('div', {
        class: this.baseCls + '__item',
        style: this.itemStyle,
        key: 'rumo-space-item-' + idx
      }, [child]));
      const isLast = idx === len - 1;
      if (!isLast && (this.spacer !== null || this.$slots.spacer)) {
        const spacerStyle = [this.itemStyle];
        if (this.direction === 'vertical') {
          spacerStyle.push({ width: '100%' });
        }
        const content = this.$slots.spacer
          ? this.$slots.spacer
          : [String(this.spacer)];
        items.push(h('span', {
          class: this.baseCls + '__spacer',
          style: spacerStyle,
          key: 'rumo-space-spacer-' + idx
        }, content));
      }
    });

    return h('div', {
      class: ['rumo-space', 'rumo-space--' + this.direction],
      style: this.containerStyle
    }, items);
  }
};
