<script>
// Derived from element-plus/packages/components/avatar/src/{avatar.vue,avatar-group.tsx} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
export default {
  name: 'RumoAvatar', componentName: 'RumoAvatar',
  inject: { rumoAvatarGroup: { default: null } },
  props: {
    size: {
      type: [Number, String],
      validator(val) { return typeof val === 'number' || ['large', 'medium', 'small'].indexOf(val) > -1; }
    },
    shape: {
      type: String,
      validator(val) { return ['circle', 'square'].indexOf(val) > -1; }
    },
    icon: String, src: String, alt: String, srcSet: String, error: Function,
    fit: { type: String, default: 'cover' }
  },
  data() { return { isImageExist: true }; },
  computed: {
    effectiveSize() { return this.size !== undefined ? this.size : this.rumoAvatarGroup && this.rumoAvatarGroup.size; },
    effectiveShape() { return this.shape !== undefined ? this.shape : (this.rumoAvatarGroup && this.rumoAvatarGroup.shape) || 'circle'; },
    avatarClass() {
      const classes = ['rumo-avatar'];
      if (typeof this.effectiveSize === 'string') classes.push('rumo-avatar--' + this.effectiveSize);
      if (this.icon) classes.push('rumo-avatar--icon');
      classes.push('rumo-avatar--' + this.effectiveShape);
      return classes;
    }
  },
  methods: {
    handleError() {
      const flag = this.error ? this.error() : undefined;
      if (flag !== false) this.isImageExist = false;
    },
    renderAvatar(h) {
      if (this.isImageExist && this.src) {
        return h('img', { attrs: { src: this.src, alt: this.alt, srcset: this.srcSet },
          style: { objectFit: this.fit }, on: { error: this.handleError } });
      }
      if (this.icon) return h('i', { class: ['rumo-icons', this.icon] });
      return this.$slots.default;
    }
  },
  render(h) {
    const size = this.effectiveSize;
    const style = typeof size === 'number' ? { height: size + 'px', width: size + 'px', lineHeight: size + 'px' } : {};
    return h('span', { class: this.avatarClass, style }, [this.renderAvatar(h)]);
  }
};
</script>
