<template>
  <div class="rumo-card" :class="[
    shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow',
    interactive ? 'is-interactive' : ''
  ]">
    <div class="rumo-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="rumo-card__body" :style="bodyStyleObject">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RumoCard',

    props: {
      header: {},
      bodyStyle: {},
      shadow: {
        type: String
      },
      /** Dash 皮肤:卡体内边距,数字按 px;未设时沿用 bodyStyle / 默认样式 */
      padding: {
        type: [String, Number],
        default: ''
      },
      /** Dash 皮肤:悬停边框变深 + 弱阴影 */
      interactive: Boolean
    },

    computed: {
      bodyStyleObject() {
        var padding = this.padding;
        if (padding === '' || padding === null || padding === undefined) {
          return this.bodyStyle;
        }
        var style = {};
        var bodyStyle = this.bodyStyle;
        if (bodyStyle) {
          for (var key in bodyStyle) {
            if (Object.prototype.hasOwnProperty.call(bodyStyle, key)) {
              style[key] = bodyStyle[key];
            }
          }
        }
        style.padding = typeof padding === 'number' ? padding + 'px' : padding;
        return style;
      }
    }
  };
</script>
