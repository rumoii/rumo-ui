<template>
  <component
    :is="tag"
    ref="text"
    :class="textKls"
    :title="computedTitle"
    :style="clampStyle"
  >
    <slot></slot>
  </component>
</template>

<script>
// Derived from element-plus/packages/components/text/src/{text.vue,text.ts} (MIT) — https://github.com/element-plus/element-plus
import { addResizeListener, removeResizeListener } from 'rumo-ui/src/utils/resize-event';

export default {
  name: 'RumoText',

  inject: {
    rumoForm: {
      default: null
    }
  },

  props: {
    type: {
      type: String,
      default: '',
      validator: val => ['primary', 'success', 'info', 'warning', 'danger', ''].indexOf(val) > -1
    },
    size: {
      type: String,
      default: ''
    },
    truncated: Boolean,
    lineClamp: {
      type: [String, Number]
    },
    tag: {
      type: String,
      default: 'span'
    }
  },

  data() {
    return {
      isTruncated: false,
      rafId: null
    };
  },

  computed: {
    textKls() {
      return [
        'rumo-text',
        this.type ? 'rumo-text--' + this.type : '',
        this.textSize ? 'rumo-text--' + this.textSize : '',
        {
          'is-truncated': this.truncated,
          'is-line-clamp': this.lineClamp !== undefined
        }
      ];
    },
    textSize() {
      return this.size || (this.rumoForm && this.rumoForm.size) || (this.$RUMO && this.$RUMO.size) || '';
    },
    clampStyle() {
      return this.lineClamp !== undefined
        ? { '-webkit-line-clamp': this.lineClamp }
        : {};
    },
    computedTitle() {
      if (this.$attrs.title !== undefined) return this.$attrs.title;
      return this.isTruncated ? (this.$refs.text ? this.$refs.text.textContent : undefined) : undefined;
    }
  },

  watch: {
    truncated: 'bindTitle',
    lineClamp: 'bindTitle'
  },

  mounted() {
    this.bindTitle();
    addResizeListener(this.$refs.text, this.bindTitle);
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(this.bindTitle);
      this.observer.observe(this.$refs.text, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        subtree: true,
        childList: true,
        characterData: true
      });
    }
  },

  beforeDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    removeResizeListener(this.$refs.text, this.bindTitle);
  },

  methods: {
    bindTitle() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.isTruncated = false;
        const el = this.$refs.text;
        if (!el) return;

        if (this.truncated) {
          if (el.offsetWidth && el.scrollWidth && el.scrollWidth > el.offsetWidth) {
            this.isTruncated = true;
          }
        } else if (this.lineClamp !== undefined) {
          if (el.offsetHeight && el.scrollHeight && el.scrollHeight > el.offsetHeight) {
            this.isTruncated = true;
          }
        }
      });
    }
  }
};
</script>
