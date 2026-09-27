// Uses Tabler Icons icon data (MIT) — https://github.com/tabler/tabler-icons @0239805680a36bab4e1070529b6744924402d804
// Icon data lives in rumo-ui/src/icons/tabler (generated, grouped modules)
import { icons } from 'rumo-ui/src/icons/tabler';

export default {
  name: 'RumoSvgIcon',

  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    title: {
      type: String,
      default: ''
    }
  },

  computed: {
    paths() {
      return icons[this.name] || [];
    },
    sizeValue() {
      return typeof this.size === 'number' ? this.size + 'px' : this.size;
    }
  },

  render(h) {
    const children = [];
    if (this.title) {
      children.push(h('title', this.title));
    }
    this.paths.forEach((d, i) => {
      children.push(h('path', {
        attrs: {
          d: d,
          key: 'rumo-svg-icon-path-' + i
        }
      }));
    });
    return h('svg', {
      class: 'rumo-svg-icon',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: this.sizeValue,
        height: this.sizeValue,
        fill: 'none',
        stroke: this.color,
        'stroke-width': 2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': this.title ? null : 'true',
        role: this.title ? 'img' : null
      }
    }, children);
  }
};
