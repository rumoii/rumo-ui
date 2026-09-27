<script>
// Derived from element-plus/packages/components/avatar/src/{avatar-group.tsx,avatar-group-props.ts,constants.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import Avatar from 'rumo-ui/packages/avatar';
import Tooltip from 'rumo-ui/packages/tooltip';
export default {
  name: 'RumoAvatarGroup', componentName: 'RumoAvatarGroup',
  provide() { return { rumoAvatarGroup: this }; },
  props: {
    size: [String, Number], shape: String, collapseAvatars: Boolean, collapseAvatarsTooltip: Boolean,
    maxCollapseAvatars: { type: Number, default: 1 }, effect: { type: String, default: 'light' },
    placement: { type: String, default: 'top' }, popperClass: String,
    collapseClass: [String, Array, Object], collapseStyle: [String, Array, Object]
  },
  render(h) {
    const avatars = (this.$slots.default || []).filter(node => !node.isComment && (node.tag || String(node.text || '').trim()));
    const max = Math.max(0, Math.floor(this.maxCollapseAvatars) || 0);
    const shouldCollapse = this.collapseAvatars && avatars.length > max;
    const visible = shouldCollapse ? avatars.slice(0, max) : avatars;
    if (shouldCollapse) {
      const hidden = avatars.slice(max);
      const marker = h(Avatar, { class: this.collapseClass, style: this.collapseStyle }, ['+ ' + hidden.length]);
      visible.push(this.collapseAvatarsTooltip ? h(Tooltip, {
        props: { effect: this.effect, placement: this.placement, popperClass: this.popperClass }
      }, [marker, h('div', { slot: 'content', class: 'rumo-avatar-group__collapse-avatars' }, hidden)]) : marker);
    }
    return h('div', { class: 'rumo-avatar-group' }, visible);
  }
};
</script>
