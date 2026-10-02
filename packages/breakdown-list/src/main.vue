<template>
  <div class="rumo-breakdown-list">
    <div v-if="$slots.title" class="rumo-breakdown-list__title">
      <slot name="title"></slot>
    </div>

    <ul class="rumo-breakdown-list__list" role="list">
      <li
        v-for="item in flatRows"
        :key="item.key"
        class="rumo-breakdown-list__row"
        :class="{ 'rumo-breakdown-list__row--child': item.depth > 0 }"
        :style="rowStyle(item)"
        role="listitem"
        @click="onRowClick(item)"
      >
        <!-- 行内分布条:按占比染色的行背景,宽度即占比 -->
        <div
          v-if="item.percent !== null"
          class="rumo-breakdown-list__share"
          :style="{ width: item.shareWidth + '%', backgroundColor: item.color }"
          aria-hidden="true"
        ></div>

        <div class="rumo-breakdown-list__main">
          <span class="rumo-breakdown-list__icon">
            <slot name="icon" :row="item.row">
              <i
                v-if="item.showDot"
                class="rumo-breakdown-list__dot"
                :style="{ backgroundColor: item.color }"
              ></i>
            </slot>
          </span>

          <span class="rumo-breakdown-list__label-wrap">
            <span class="rumo-breakdown-list__label">{{ item.label }}</span>
            <button
              v-if="item.hasChildren"
              type="button"
              class="rumo-breakdown-list__toggle"
              :aria-expanded="item.expanded ? 'true' : 'false'"
              :aria-label="item.label"
              @click.stop="onToggle(item)"
            >
              <i
                class="rumo-breakdown-list__chevron"
                :class="{ 'is-open': item.expanded }"
                aria-hidden="true"
              ></i>
            </button>
          </span>

          <span class="rumo-breakdown-list__value rumo-num">{{ item.displayValue }}</span>
          <span
            v-if="item.percent !== null"
            class="rumo-breakdown-list__percent rumo-num"
          >{{ item.percentLabel }}</span>
          <span v-else class="rumo-breakdown-list__percent"></span>
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
  name: 'RumoBreakdownList',

  props: {
    // 类别行:{ key?, label, value, percent?, color?, children?: Array }
    rows: {
      type: Array,
      default() {
        return [];
      }
    },
    // formatter(row) 返回右侧数值文案
    formatter: {
      type: Function,
      default: null
    },
    // 有 children 时是否提供展开交互;false 时子行常显
    expandable: {
      type: Boolean,
      default: true
    },
    // 初始是否展开全部分组
    defaultExpandAll: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      expandedMap: this.buildInitialExpanded()
    };
  },

  computed: {
    // 顶层合计,用于缺省占比
    total: function() {
      var acc = 0;
      var rows = this.rows || [];
      for (var i = 0; i < rows.length; i++) {
        acc += toNumber(rows[i] && rows[i].value);
      }
      return acc;
    },

    // 展平为可见行:折叠分组的 children 不进入列表
    flatRows: function() {
      var out = [];
      var total = this.total;
      var formatter = this.formatter;
      var expandable = this.expandable;
      var expandedMap = this.expandedMap;

      function walk(list, depth, parentKey) {
        var arr = list || [];
        for (var i = 0; i < arr.length; i++) {
          var row = arr[i] || {};
          var key = parentKey + ':' + (row.key != null ? row.key : i);
          var children = row.children;
          var hasChildren = expandable && Array.isArray(children) && children.length > 0;
          var alwaysVisibleChildren = !expandable && Array.isArray(children) && children.length > 0;
          var value = toNumber(row.value);
          var percent = null;
          if (row.percent != null && isFinite(Number(row.percent))) {
            percent = Number(row.percent);
          } else if (depth === 0 && total > 0) {
            percent = (value / total) * 100;
          }
          var color = row.color || SERIES_COLORS[i % SERIES_COLORS.length];
          var showDot = depth === 0 || !!row.color;
          var expanded = hasChildren ? !!expandedMap[key] : alwaysVisibleChildren;

          out.push({
            key: key,
            row: row,
            depth: depth,
            label: row.label != null ? String(row.label) : '',
            value: value,
            color: color,
            showDot: showDot,
            hasChildren: hasChildren,
            expanded: expanded,
            percent: percent,
            shareWidth: percent === null ? 0 : Math.max(0, Math.min(100, percent)),
            percentLabel: percent === null ? '' : formatPercent(percent),
            displayValue: formatter
              ? formatter(row)
              : (row.value != null ? String(row.value) : '')
          });

          if ((hasChildren && expandedMap[key]) || alwaysVisibleChildren) {
            walk(children, depth + 1, key);
          }
        }
      }

      walk(this.rows, 0, 'r');
      return out;
    }
  },

  methods: {
    buildInitialExpanded: function() {
      var map = {};
      if (!this.defaultExpandAll) return map;

      var walk = function(list, parentKey) {
        var arr = list || [];
        for (var i = 0; i < arr.length; i++) {
          var row = arr[i] || {};
          var key = parentKey + ':' + (row.key != null ? row.key : i);
          var children = row.children;
          if (Array.isArray(children) && children.length > 0) {
            map[key] = true;
            walk(children, key);
          }
        }
      };

      walk(this.rows, 'r');
      return map;
    },

    rowStyle: function(item) {
      // 子行按层缩进,与展开层级对齐
      return item.depth > 0
        ? { paddingLeft: (item.depth * 16) + 'px' }
        : null;
    },

    onRowClick: function(item) {
      this.$emit('row-click', item.row);
    },

    onToggle: function(item) {
      if (!item.hasChildren) return;
      var next = !this.expandedMap[item.key];
      this.$set(this.expandedMap, item.key, next);
      this.$emit('toggle', item.row, next);
    }
  }
};
</script>
