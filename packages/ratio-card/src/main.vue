<template>
  <div class="rumo-ratio-card">
    <div class="rumo-ratio-card__header">
      <slot name="header">{{ title }}</slot>
    </div>

    <ul class="rumo-ratio-card__list" role="list">
      <li
        v-for="item in normalized"
        :key="item.key"
        class="rumo-ratio-card__item"
        role="listitem"
      >
        <div class="rumo-ratio-card__row">
          <span class="rumo-ratio-card__icon">
            <slot name="icon" :item="item.raw">
              <i
                class="rumo-ratio-card__dot"
                :style="{ backgroundColor: item.color }"
              ></i>
            </slot>
          </span>
          <span class="rumo-ratio-card__label">{{ item.label }}</span>
          <span class="rumo-ratio-card__value rumo-num">
            {{ item.displayValue }}<span class="rumo-ratio-card__ratio"> · {{ item.ratioLabel }}</span>
          </span>
        </div>

        <div
          class="rumo-ratio-card__track"
          role="img"
          :aria-label="item.label + ': ' + item.ratioLabel"
        >
          <div
            class="rumo-ratio-card__fill"
            :style="{ width: item.ratioWidth + '%', backgroundColor: item.color }"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* 分类色板(dash series-1..8),与 tokens/tokens.json dash.color.series 对齐。 */
var SERIES_COLORS = [
  'var(--rumo-c-series-1, #8b5cf6)',
  'var(--rumo-c-series-2, #3b82f6)',
  'var(--rumo-c-series-3, #14b8a6)',
  'var(--rumo-c-series-4, #f59e0b)',
  'var(--rumo-c-series-5, #f43f5e)',
  'var(--rumo-c-series-6, #06b6d4)',
  'var(--rumo-c-series-7, #f97316)',
  'var(--rumo-c-series-8, #64748b)'
];

/* 源码细节:0 < p < 0.1 时保留两位小数,极小占比不塌成 0.0%。 */
function formatPercent(p) {
  if (p > 0 && p < 0.1) return p.toFixed(2) + '%';
  return p.toFixed(1) + '%';
}

function toNumber(v) {
  var n = Number(v);
  return isFinite(n) ? n : 0;
}

export default {
  name: 'RumoRatioCard',

  props: {
    // 卡片标题;header 插槽存在时优先用插槽
    title: {
      type: String,
      default: ''
    },
    // 明细行:{ label, value, ratio?, color? }
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    // 声明总量,缺省为各行 value 之和
    total: {
      type: [Number, String],
      default: 0
    },
    // formatter(item) 返回右侧数值文案
    formatter: {
      type: Function,
      default: null
    }
  },

  computed: {
    sum: function() {
      var declared = Number(this.total);
      if (declared > 0) return declared;
      var acc = 0;
      var items = this.items || [];
      for (var i = 0; i < items.length; i++) {
        acc += toNumber(items[i] && items[i].value);
      }
      return acc;
    },

    normalized: function() {
      var total = this.sum;
      var formatter = this.formatter;
      return (this.items || []).map(function(item, idx) {
        var src = item || {};
        var value = toNumber(src.value);
        var ratio = 0;
        if (src.ratio != null && isFinite(Number(src.ratio))) {
          ratio = Number(src.ratio);
        } else if (total > 0) {
          ratio = (value / total) * 100;
        }
        return {
          key: src.key != null ? src.key : idx,
          raw: src,
          label: src.label != null ? String(src.label) : '',
          value: value,
          color: src.color || SERIES_COLORS[idx % SERIES_COLORS.length],
          ratioWidth: Math.max(0, Math.min(100, ratio)),
          ratioLabel: formatPercent(ratio),
          displayValue: formatter
            ? formatter(src)
            : (src.value != null ? String(src.value) : '')
        };
      });
    }
  }
};
</script>
