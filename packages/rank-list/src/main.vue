<template>
  <div class="rumo-rank-list">
    <div v-if="$slots.badge" class="rumo-rank-list__badges">
      <slot name="badge"></slot>
    </div>

    <div
      v-for="row in displayRows"
      :key="row.key"
      class="rumo-rank-list__row"
      @click="onRowClick(row)"
    >
      <span class="rumo-rank-list__rank">{{ row.rank }}</span>

      <div class="rumo-rank-list__main">
        <div class="rumo-rank-list__line">
          <span class="rumo-rank-list__name" :title="row.name">{{ row.name }}</span>
          <span class="rumo-rank-list__value rumo-num">{{ row.displayValue }}</span>
          <span v-if="row.percentLabel" class="rumo-rank-list__percent rumo-num">{{ row.percentLabel }}</span>
        </div>
        <div v-if="showBar" class="rumo-rank-list__bar">
          <div
            class="rumo-rank-list__bar-fill"
            :style="{ width: row.barWidth + '%', backgroundColor: row.color }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RumoRankList',

  props: {
    // 榜单项:{ rank?, name, value, percent?, color? };rank 缺省用索引 + 1
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    // 显示条数
    max: {
      type: Number,
      default: 3
    },
    // 数值文案格式化 item => string
    valueText: {
      type: Function,
      default: null
    },
    // 是否渲染行内占比条
    showBar: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    displayRows() {
      var max = Number(this.max);
      if (!isFinite(max) || max < 0) max = 3;
      max = Math.floor(max);
      var source = this.items.slice(0, max);
      // 无 percent 时按相对最大 value 求占比;有 percent 时直接按 0-100 铺轨道
      var maxValue = 0;
      source.forEach(function(item) {
        var n = Number(item && item.value) || 0;
        if (n > maxValue) maxValue = n;
      });

      return source.map(function(item, idx) {
        var raw = item || {};
        var name = raw.name != null ? String(raw.name) : '';
        var value = raw.value;
        var percent = typeof raw.percent === 'number' && isFinite(raw.percent) ? raw.percent : null;
        var barWidth;
        if (percent !== null) {
          barWidth = Math.max(0, Math.min(100, percent));
        } else {
          barWidth = maxValue > 0
            ? Math.max(0, Math.min(100, ((Number(value) || 0) / maxValue) * 100))
            : 0;
        }
        var percentLabel = percent !== null ? String(percent) + '%' : '';
        var color = raw.color || '';
        return {
          key: raw.rank != null ? raw.rank : idx,
          rank: raw.rank != null ? raw.rank : idx + 1,
          name: name,
          value: value,
          percent: percent,
          color: color,
          barWidth: barWidth,
          percentLabel: percentLabel,
          displayValue: this.valueText
            ? this.valueText(raw)
            : (value === null || value === undefined ? '' : String(value)),
          item: raw
        };
      }, this);
    }
  },

  methods: {
    onRowClick(row) {
      this.$emit('item-click', row.item, row);
    }
  }
};
</script>
