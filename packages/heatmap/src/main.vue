<template>
  <div class="rumo-heatmap">
    <div v-if="$slots.title" class="rumo-heatmap__header">
      <slot name="title"></slot>
    </div>

    <div ref="scroll" class="rumo-heatmap__scroll">
      <div class="rumo-heatmap__board" :style="boardStyle">
        <div
          v-if="monthLabels && monthMarkers.length"
          class="rumo-heatmap__months"
          :style="monthsStyle"
        >
          <span v-if="showGutter" class="rumo-heatmap__month-gap"></span>
          <span
            v-for="m in monthMarkers"
            :key="m.key"
            class="rumo-heatmap__month"
            :style="{ gridColumnStart: m.column }"
          >{{ m.label }}</span>
        </div>

        <div class="rumo-heatmap__body" :style="bodyStyle">
          <div
            v-if="showGutter"
            class="rumo-heatmap__weekdays"
            :style="weekdayStyle"
          >
            <span
              v-for="(lab, idx) in dayLabels"
              :key="idx"
              class="rumo-heatmap__weekday"
            >{{ lab }}</span>
          </div>

          <div class="rumo-heatmap__cells" :style="cellsStyle">
            <span
              v-for="cell in flatCells"
              :key="cell.date"
              class="rumo-heatmap__cell"
              :style="cellStyle(cell)"
              :title="tooltipText(cell)"
              @click="onCellClick(cell)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 日期一律按 UTC 解析 YYYY-MM-DD,避免本地时区把「日」错位。 */
function parseDate(str) {
  if (typeof str !== 'string') return null;
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str.trim());
  if (!m) return null;
  var dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return isFinite(dt.getTime()) ? dt : null;
}

function formatDate(dt) {
  var m = dt.getUTCMonth() + 1;
  var d = dt.getUTCDate();
  return dt.getUTCFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}

function addDays(dt, n) {
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() + n));
}

function diffDays(a, b) {
  return Math.floor(
    (Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()) -
      Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate())) /
      86400000
  );
}

function quantile(sorted, q) {
  if (!sorted.length) return 0;
  var n = sorted.length;
  var pos = (n - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  var left = sorted[base];
  var right = sorted[Math.min(n - 1, base + 1)];
  if (left == null) left = sorted[n - 1];
  if (right == null) right = sorted[n - 1];
  return Math.round(left + (right - left) * rest);
}

function toCssSize(val, fallbackPx) {
  if (typeof val === 'number' && isFinite(val)) return val + 'px';
  if (typeof val === 'string' && val.trim() !== '') return val.trim();
  return fallbackPx + 'px';
}

function toPx(val, fallback) {
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') {
    var m = /^(\d+(?:\.\d+)?)(px)?$/.exec(val.trim());
    if (m) return parseFloat(m[1]);
  }
  return fallback;
}

var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var DEFAULT_PALETTE = [
  'var(--rumo-c-accent-50, #f4f4ff)',
  'var(--rumo-c-accent-200, #d4d2fe)',
  'var(--rumo-c-accent-400, #9d8ffd)',
  'var(--rumo-c-accent-600, #7355e3)',
  'var(--rumo-c-accent-800, #4f38a2)'
];
var LABEL_WIDTH = 26;

export default {
  name: 'RumoHeatmap',

  props: {
    // 日格数据:{ date: 'YYYY-MM-DD', value: number },区间取 min/max date
    cells: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 0=周日、1=周一
    weekStartsOn: {
      type: Number,
      default: 1
    },
    // 5 档色阶:无数据/低/中/高/峰值
    palette: {
      type: Array,
      default: function() {
        return DEFAULT_PALETTE.slice();
      }
    },
    cellSize: {
      type: [Number, String],
      default: 12
    },
    gap: {
      type: [Number, String],
      default: 3
    },
    // formatter(date, value) 返回 tooltip 文案
    formatTooltip: {
      type: Function,
      default: null
    },
    monthLabels: {
      type: Boolean,
      default: true
    },
    weekdayLabels: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    weekStart() {
      return this.weekStartsOn === 0 ? 0 : 1;
    },

    showGutter() {
      return this.weekdayLabels;
    },

    cellCss() {
      return toCssSize(this.cellSize, 12);
    },

    gapCss() {
      return toCssSize(this.gap, 3);
    },

    cellPx() {
      return toPx(this.cellSize, 12);
    },

    gapPx() {
      return toPx(this.gap, 3);
    },

    labelPx() {
      return this.showGutter ? LABEL_WIDTH : 0;
    },

    resolvedPalette() {
      var list = this.palette;
      return list && list.length ? list : DEFAULT_PALETTE;
    },

    /* 周列网格 + 月标,cells/weekStartsOn 变更时整体重算,不做深度 watch */
    model() {
      var list = Array.isArray(this.cells) ? this.cells : [];
      var byDate = {};
      var minDt = null;
      var maxDt = null;
      var i;

      for (i = 0; i < list.length; i++) {
        var row = list[i];
        if (!row || row.date == null) continue;
        var dt = parseDate(String(row.date));
        if (!dt) continue;
        var key = formatDate(dt);
        var num = Number(row.value);
        byDate[key] = isFinite(num) && num > 0 ? num : 0;
        if (!minDt || dt.getTime() < minDt.getTime()) minDt = dt;
        if (!maxDt || dt.getTime() > maxDt.getTime()) maxDt = dt;
      }

      if (!minDt || !maxDt) {
        return { weeks: [], monthMarkers: [], weekCount: 0, totalWidth: 0 };
      }

      var start = this.weekStart;
      var startDow = minDt.getUTCDay();
      var startAligned = addDays(minDt, -((startDow - start + 7) % 7));
      var totalDays = diffDays(startAligned, maxDt) + 1;
      var weekCount = Math.ceil(totalDays / 7);

      var positives = [];
      for (i = 0; i < totalDays; i++) {
        var dayKey = formatDate(addDays(startAligned, i));
        var v = byDate[dayKey];
        if (v > 0) positives.push(v);
      }
      positives.sort(function(a, b) {
        return a - b;
      });
      var t1 = quantile(positives, 0.5);
      var t2 = quantile(positives, 0.75);
      var t3 = quantile(positives, 0.9);

      function levelFor(value) {
        if (!value || value <= 0) return 0;
        if (value <= t1) return 1;
        if (value <= t2) return 2;
        if (value <= t3) return 3;
        return 4;
      }

      var weeks = [];
      for (var w = 0; w < weekCount; w++) {
        var week = [];
        for (var d = 0; d < 7; d++) {
          var idx = w * 7 + d;
          if (idx >= totalDays) {
            week.push(null);
            continue;
          }
          var dayDt = addDays(startAligned, idx);
          var dayStr = formatDate(dayDt);
          var dayVal = byDate[dayStr] || 0;
          week.push({
            date: dayStr,
            value: dayVal,
            level: levelFor(dayVal)
          });
        }
        weeks.push(week);
      }

      /* 月标落在「该月 1 日」所在周列;首周若只是残月(1 日不在格内)则补一标,每周列至多一个 */
      var colOffset = this.showGutter ? 2 : 1;
      var monthMarkers = [];
      var usedCols = {};
      for (var wi = 0; wi < weekCount; wi++) {
        for (var di = 0; di < 7; di++) {
          var diIdx = wi * 7 + di;
          if (diIdx >= totalDays) break;
          var mDt = addDays(startAligned, diIdx);
          if (mDt.getUTCDate() === 1) {
            usedCols[wi] = true;
            monthMarkers.push({
              key: mDt.getUTCFullYear() + '-' + mDt.getUTCMonth(),
              label: MONTH_NAMES[mDt.getUTCMonth()],
              column: wi + colOffset
            });
          }
        }
      }
      if (!usedCols[0] && totalDays > 0) {
        var leadDt = startAligned;
        monthMarkers.push({
          key: leadDt.getUTCFullYear() + '-' + leadDt.getUTCMonth(),
          label: MONTH_NAMES[leadDt.getUTCMonth()],
          column: colOffset
        });
      }
      monthMarkers.sort(function(a, b) {
        return a.column - b.column;
      });

      var totalWidth;
      if (this.showGutter) {
        totalWidth = this.labelPx + weekCount * this.cellPx + weekCount * this.gapPx;
      } else {
        totalWidth = weekCount * this.cellPx + Math.max(0, weekCount - 1) * this.gapPx;
      }

      return {
        weeks: weeks,
        monthMarkers: monthMarkers,
        weekCount: weekCount,
        totalWidth: totalWidth
      };
    },

    monthMarkers() {
      return this.model.monthMarkers;
    },

    weekCount() {
      return this.model.weekCount;
    },

    flatCells() {
      var weeks = this.model.weeks;
      var out = [];
      for (var w = 0; w < weeks.length; w++) {
        var week = weeks[w];
        for (var d = 0; d < week.length; d++) {
          if (week[d]) out.push(week[d]);
        }
      }
      return out;
    },

    /* 一/三/五(Mon/Wed/Fri)三行标签,其余行留空 */
    dayLabels() {
      var labels = ['', '', '', '', '', '', ''];
      if (!this.weekdayLabels) return labels;
      var start = this.weekStart;
      labels[(1 - start + 7) % 7] = 'Mon';
      labels[(3 - start + 7) % 7] = 'Wed';
      labels[(5 - start + 7) % 7] = 'Fri';
      return labels;
    },

    boardStyle() {
      return { minWidth: this.model.totalWidth + 'px' };
    },

    monthsStyle() {
      var cols = this.showGutter
        ? this.labelPx + 'px repeat(' + this.weekCount + ', ' + this.cellCss + ')'
        : 'repeat(' + this.weekCount + ', ' + this.cellCss + ')';
      return {
        gridTemplateColumns: cols,
        columnGap: this.gapCss
      };
    },

    bodyStyle() {
      if (!this.showGutter) return { display: 'block' };
      return {
        display: 'grid',
        gridTemplateColumns: this.labelPx + 'px auto',
        columnGap: this.gapCss
      };
    },

    weekdayStyle() {
      return {
        width: this.labelPx + 'px',
        gridTemplateRows: 'repeat(7, ' + this.cellCss + ')',
        rowGap: this.gapCss
      };
    },

    cellsStyle() {
      return {
        gridTemplateColumns: 'repeat(' + this.weekCount + ', ' + this.cellCss + ')',
        gridTemplateRows: 'repeat(7, ' + this.cellCss + ')',
        gridAutoFlow: 'column',
        gap: this.gapCss
      };
    }
  },

  watch: {
    weekCount() {
      this.$nextTick(this.scrollToEnd);
    }
  },

  mounted() {
    this.scrollToEnd();
  },

  methods: {
    /* 初始化与周数变化时滚到最右(最近一周) */
    scrollToEnd() {
      var el = this.$refs.scroll;
      if (el) el.scrollLeft = el.scrollWidth;
    },

    cellStyle(cell) {
      var palette = this.resolvedPalette;
      var level = Number(cell.level) || 0;
      if (level < 0) level = 0;
      if (level > palette.length - 1) level = palette.length - 1;
      return {
        width: this.cellCss,
        height: this.cellCss,
        backgroundColor: palette[level]
      };
    },

    tooltipText(cell) {
      if (this.formatTooltip) {
        return this.formatTooltip(cell.date, cell.value);
      }
      return cell.date + ': ' + cell.value;
    },

    onCellClick(cell) {
      this.$emit('cell-click', { date: cell.date, value: cell.value });
    }
  }
};
</script>
