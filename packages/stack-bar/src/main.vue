<template>
  <div class="rumo-stack-bar">
    <div
      v-if="showLegend && legendPosition === 'top'"
      class="rumo-stack-bar__legend"
    >
      <span
        v-for="seg in normalized"
        :key="seg.key"
        class="rumo-stack-bar__legend-item"
        @click="$emit('segment-click', seg)"
      >
        <i class="rumo-stack-bar__dot" :style="{ backgroundColor: seg.color }"></i>
        <span class="rumo-stack-bar__label">{{ seg.label }}</span>
        <span class="rumo-stack-bar__value rumo-num">{{ seg.displayValue }}</span>
      </span>
    </div>

    <div
      class="rumo-stack-bar__track"
      :style="trackStyle"
      role="img"
      :aria-label="ariaLabel"
    >
      <div
        v-for="seg in normalized"
        :key="seg.key"
        class="rumo-stack-bar__segment"
        :style="{ width: seg.percent + '%', backgroundColor: seg.color }"
        :title="seg.label + ': ' + seg.percentLabel"
        @click="$emit('segment-click', seg)"
      ></div>
    </div>

    <div
      v-if="showLegend && legendPosition === 'bottom'"
      class="rumo-stack-bar__legend"
    >
      <span
        v-for="seg in normalized"
        :key="seg.key"
        class="rumo-stack-bar__legend-item"
        @click="$emit('segment-click', seg)"
      >
        <i class="rumo-stack-bar__dot" :style="{ backgroundColor: seg.color }"></i>
        <span class="rumo-stack-bar__label">{{ seg.label }}</span>
        <span class="rumo-stack-bar__value rumo-num">{{ seg.displayValue }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RumoStackBar',

  props: {
    // 数据段:{ key?, label, value, color? },color 缺省时按 series 色板循环
    segments: {
      type: Array,
      default() {
        return [];
      }
    },
    // 总量,缺省为各段 value 之和
    total: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 6
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    legendPosition: {
      type: String,
      default: 'bottom'
    },
    // formatter(segment, percent) 返回图例数值文案
    formatter: {
      type: Function,
      default: null
    }
  },

  computed: {
    sum() {
      const declared = Number(this.total);
      if (declared > 0) return declared;
      let acc = 0;
      this.segments.forEach(seg => {
        acc += Number(seg && seg.value) || 0;
      });
      return acc;
    },
    normalized() {
      const total = this.sum;
      return this.segments.map((seg, idx) => {
        const value = Number(seg && seg.value) || 0;
        const percent = total > 0 ? (value / total) * 100 : 0;
        const color = (seg && seg.color) || 'var(--rumo-c-series-' + ((idx % 8) + 1) + ')';
        const percentLabel = percent.toFixed(1);
        return {
          key: (seg && seg.key) != null ? seg.key : idx,
          label: (seg && seg.label) || '',
          value,
          color,
          percent,
          percentLabel,
          displayValue: this.formatter
            ? this.formatter(seg, percent)
            : percentLabel + '%'
        };
      });
    },
    trackStyle() {
      const h = Number(this.height);
      return {
        height: (isNaN(h) ? this.height : h + 'px')
      };
    },
    ariaLabel() {
      return this.normalized
        .map(seg => seg.label + ' ' + seg.percentLabel + '%')
        .join(', ');
    }
  }
};
</script>
