<template>
  <div
    class="rumo-stat-grid"
    :class="gridClass"
    :style="gapStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
// 窄视口回落 2 列(1 列时保持 1 列);宽视口恢复 columns 列
var MAX_COLUMNS = 8;

export default {
  name: 'RumoStatGrid',

  props: {
    // 列数,1-8;默认 4
    columns: {
      type: Number,
      default: 4
    },
    // 栅格间距,数字按 px
    gap: {
      type: [Number, String],
      default: 8
    }
  },

  computed: {
    normalizedColumns() {
      var n = Number(this.columns);
      if (!isFinite(n) || n < 1) return 4;
      n = Math.floor(n);
      return n > MAX_COLUMNS ? MAX_COLUMNS : n;
    },
    gridClass() {
      return 'rumo-stat-grid--cols-' + this.normalizedColumns;
    },
    gapStyle() {
      var g = this.gap;
      if (g === null || g === undefined || g === '') return {};
      var n = Number(g);
      return { gap: isNaN(n) ? String(g) : n + 'px' };
    }
  }
};
</script>
