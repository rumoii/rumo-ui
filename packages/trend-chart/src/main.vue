<template>
  <div
    class="rumo-trend-chart"
    :class="{ 'is-embedded': embedded }"
  >
    <div
      v-if="!embedded && (zoomable || $slots.title)"
      class="rumo-trend-chart__header"
    >
      <div class="rumo-trend-chart__title">
        <slot name="title"></slot>
      </div>
      <button
        v-if="zoomable"
        type="button"
        class="rumo-trend-chart__zoom-btn"
        :aria-label="zoomAriaLabel"
        :title="zoomAriaLabel"
        @click="$emit('zoom')"
      >
        <i class="rumo-icons icon-full-screen rumo-icons-14"></i>
      </button>
    </div>

    <div class="rumo-trend-chart__body">
      <div
        ref="plot"
        class="rumo-trend-chart__plot"
        :style="plotStyle"
      >
        <div class="rumo-trend-chart__grid" aria-hidden="true">
          <div
            v-for="pct in gridPercents"
            :key="pct"
            class="rumo-trend-chart__grid-line"
            :style="{ top: (100 - pct) + '%' }"
          ></div>
        </div>

        <div
          v-if="bars.length"
          class="rumo-trend-chart__bars"
        >
          <div
            v-for="bar in bars"
            :key="bar.index"
            class="rumo-trend-chart__col"
            role="button"
            :aria-label="bar.label + ': ' + bar.valueText"
            @mouseenter="handleColEnter(bar, $event)"
            @mouseleave="handleColLeave"
            @click="$emit('bar-click', segOf(bar))"
          >
            <div class="rumo-trend-chart__col-guide"></div>
            <div
              class="rumo-trend-chart__bar"
              :class="'is-' + bar.kind"
              :style="{ height: bar.height, minHeight: bar.minHeight }"
            >
              <div class="rumo-trend-chart__fill"></div>
            </div>
          </div>
        </div>

        <!-- tooltip 锚点放在 plot 内,left/top 与 plot 坐标系一致 -->
        <div
          v-if="hoverBar"
          class="rumo-trend-chart__tooltip-anchor"
          :style="tooltipAnchorStyle"
          @mouseenter="cancelHide"
          @mouseleave="scheduleHide"
        >
          <div
            class="rumo-trend-chart__tooltip"
            :class="tooltipPos.flipDown ? 'is-flip-down' : 'is-flip-up'"
            :style="tooltipBoxStyle"
          >
            <div class="rumo-trend-chart__tooltip-head">
              <span class="rumo-trend-chart__tooltip-label">{{ hoverBar.label }}</span>
              <span
                v-if="hoverBar.kind === 'future' || hoverBar.kind === 'missing'"
                class="rumo-trend-chart__tooltip-badge"
              >{{ hoverBar.kind === 'future' ? 'future' : 'gap' }}</span>
            </div>
            <div class="rumo-trend-chart__tooltip-value">{{ hoverBar.valueText }}</div>
          </div>
          <div
            class="rumo-trend-chart__tooltip-arrow"
            :class="tooltipPos.flipDown ? 'is-flip-down' : 'is-flip-up'"
          ></div>
        </div>
      </div>

      <div
        v-if="bars.length"
        class="rumo-trend-chart__axis"
        aria-hidden="true"
      >
        <div
          v-for="bar in bars"
          :key="'tick-' + bar.index"
          class="rumo-trend-chart__tick"
          :class="'is-' + bar.tickAlign"
        >
          <span
            v-if="bar.isTick"
            class="rumo-trend-chart__tick-label"
          >{{ bar.tickLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 柱高与刻度的纯函数:观测值(含 0)原样保留,缺口(null)按邻柱插值/外推。
// 外推不混入最近邻,避免未走完的当前柱把后续预测整体拽低。
const EXTRAPOLATION_DECAY_PER_STEP = 0.98;
const PREVIEW_MIN_HEIGHT_PX = 4;
const BASELINE_HEIGHT_PX = 2;
const TOOLTIP_HALF_WIDTH = 140;
const TOOLTIP_EST_HEIGHT = 96;
const HIDE_DELAY_MS = 150;

function isFiniteNumber(v) {
  return typeof v === 'number' && isFinite(v);
}

function interpolateQuantile(sortedValues, ratio) {
  if (!sortedValues || !sortedValues.length) return 0;
  if (sortedValues.length === 1) return sortedValues[0];
  const index = (sortedValues.length - 1) * ratio;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  const weight = index - lower;
  return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * weight;
}

// Y 轴量程:IQR 上须裁掉离群尖峰,避免单点把其余柱压扁。
function computeScale(values) {
  const finiteValues = values
    .filter(function(v) { return isFiniteNumber(v) && v > 0; })
    .sort(function(a, b) { return a - b; });

  if (!finiteValues.length) {
    return {
      effectiveMax: 1,
      clippedValues: values.map(function() { return 0; })
    };
  }

  const rawMax = finiteValues[finiteValues.length - 1];
  let effectiveMax = rawMax;

  if (finiteValues.length >= 4) {
    const q1 = interpolateQuantile(finiteValues, 0.25);
    const q3 = interpolateQuantile(finiteValues, 0.75);
    const iqr = Math.max(q3 - q1, 0);
    const upperWhisker = q3 + iqr * 1.5;
    if (rawMax > upperWhisker) {
      effectiveMax = Math.max(upperWhisker, q3, 1);
    }
  }

  effectiveMax = Math.max(effectiveMax, 1);

  return {
    effectiveMax: effectiveMax,
    clippedValues: values.map(function(v) {
      if (!isFiniteNumber(v) || v <= 0) return 0;
      return Math.min(v, effectiveMax);
    })
  };
}

// 缺口高度:两侧有观测则线性插值;单侧有观测则按该侧均值做距离衰减外推;全空返回 0。
function computeInterpolatedSeries(rawValues) {
  const out = new Array(rawValues.length);
  let i;
  for (i = 0; i < rawValues.length; i++) {
    if (rawValues[i] !== null && rawValues[i] !== undefined) {
      out[i] = rawValues[i];
      continue;
    }

    let leftVal = null;
    let leftIdx = -1;
    let j;
    for (j = i - 1; j >= 0; j--) {
      if (rawValues[j] !== null && rawValues[j] !== undefined) {
        leftVal = rawValues[j];
        leftIdx = j;
        break;
      }
    }

    let rightVal = null;
    let rightIdx = -1;
    for (j = i + 1; j < rawValues.length; j++) {
      if (rawValues[j] !== null && rawValues[j] !== undefined) {
        rightVal = rawValues[j];
        rightIdx = j;
        break;
      }
    }

    if (leftVal !== null && rightVal !== null) {
      const ratio = (i - leftIdx) / (rightIdx - leftIdx);
      out[i] = leftVal + (rightVal - leftVal) * ratio;
    } else if (leftVal !== null) {
      let sum = 0;
      let count = 0;
      for (j = 0; j <= leftIdx; j++) {
        if (rawValues[j] !== null && rawValues[j] !== undefined) {
          sum += rawValues[j];
          count += 1;
        }
      }
      const baseLeft = count > 0 ? sum / count : leftVal;
      out[i] = baseLeft * Math.pow(EXTRAPOLATION_DECAY_PER_STEP, i - leftIdx);
    } else if (rightVal !== null) {
      let sumR = 0;
      let countR = 0;
      for (j = rightIdx; j < rawValues.length; j++) {
        if (rawValues[j] !== null && rawValues[j] !== undefined) {
          sumR += rawValues[j];
          countR += 1;
        }
      }
      const baseRight = countR > 0 ? sumR / countR : rightVal;
      out[i] = baseRight * Math.pow(EXTRAPOLATION_DECAY_PER_STEP, rightIdx - i);
    } else {
      out[i] = 0;
    }
  }
  return out;
}

function indexMap(list) {
  const map = {};
  (list || []).forEach(function(i) {
    map[i] = true;
  });
  return map;
}

export default {
  name: 'RumoTrendChart',

  props: {
    // 数值序列;null 表示缺口(柱高走插值,视觉弱化)
    series: {
      type: Array,
      default() {
        return [];
      }
    },
    // 与 series 对齐的轴/标题文案,缺省用索引
    labels: {
      type: Array,
      default() {
        return [];
      }
    },
    // 索引列表:弱化显示(缺口)
    missing: {
      type: Array,
      default() {
        return [];
      }
    },
    // 索引列表:虚化/浅色显示(预测)
    future: {
      type: Array,
      default() {
        return [];
      }
    },
    // formatter(value, index) 返回数值文案(轴缺 label 时也走这里)
    formatter: {
      type: Function,
      default: null
    },
    height: {
      type: [Number, String],
      default: 160
    },
    // 嵌入弹窗时去掉外边距/标题
    embedded: {
      type: Boolean,
      default: false
    },
    // 显示放大按钮,点击触发 zoom 事件
    zoomable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      hoverBar: null,
      tooltipPos: { x: 0, y: 0, shiftX: 0, flipDown: false },
      hideTimer: null
    };
  },

  computed: {
    rawValues() {
      return this.series.map(function(v) {
        return v === null || v === undefined ? null : v;
      });
    },

    interpolatedValues() {
      return computeInterpolatedSeries(this.rawValues);
    },

    scale() {
      const padded = this.rawValues.map(function(v) {
        return v === null || v === undefined ? 0 : v;
      });
      return computeScale(padded);
    },

    bars() {
      const self = this;
      const raw = this.rawValues;
      const interpolated = this.interpolatedValues;
      const clipped = this.scale.clippedValues;
      const effectiveMax = this.scale.effectiveMax;
      const missingMap = indexMap(this.missing);
      const futureMap = indexMap(this.future);
      const total = raw.length;
      const step = Math.max(1, Math.ceil(total / 8));

      return raw.map(function(value, index) {
        const isFuture = !!futureMap[index];
        const isMissing = !!missingMap[index] || value === null || value === undefined;
        const isPreview = isFuture || isMissing;

        let kind;
        if (isFuture) {
          kind = 'future';
        } else if (isMissing) {
          kind = 'missing';
        } else if (value > 0) {
          kind = 'real';
        } else {
          kind = 'zero';
        }

        // 观测值(含 0)用裁剪后的量程值;真缺口用插值高度,再裁到可见上限。
        let displayValue;
        if (isPreview) {
          displayValue = Math.min(interpolated[index] || 0, effectiveMax);
        } else {
          displayValue = clipped[index] || 0;
        }

        const heightPercent = effectiveMax > 0 ? (displayValue / effectiveMax) * 100 : 0;

        let height;
        let minHeight;
        if (kind === 'real') {
          height = Math.max(heightPercent, 2) + '%';
          minHeight = PREVIEW_MIN_HEIGHT_PX + 'px';
        } else if (isPreview && heightPercent > 0) {
          height = heightPercent + '%';
          minHeight = PREVIEW_MIN_HEIGHT_PX + 'px';
        } else {
          height = BASELINE_HEIGHT_PX + 'px';
          minHeight = BASELINE_HEIGHT_PX + 'px';
        }

        const label = self.labels[index] != null && self.labels[index] !== ''
          ? String(self.labels[index])
          : String(index);

        const valueText = self.formatValueText(value, displayValue, index, isPreview);

        return {
          index: index,
          label: label,
          value: value === undefined ? null : value,
          displayValue: displayValue,
          kind: kind,
          height: height,
          minHeight: minHeight,
          valueText: valueText,
          tickLabel: self.formatTickLabel(value, index, label),
          isTick: index % step === 0 || index === total - 1,
          tickAlign: index === 0 ? 'start' : (index === total - 1 ? 'end' : 'center')
        };
      });
    },

    plotStyle() {
      const h = Number(this.height);
      return {
        height: isNaN(h) ? this.height : h + 'px'
      };
    },

    gridPercents() {
      return [0, 25, 50, 75, 100];
    },

    zoomAriaLabel() {
      return 'Zoom';
    },

    tooltipAnchorStyle() {
      return {
        left: this.tooltipPos.x + 'px',
        top: this.tooltipPos.y + 'px'
      };
    },

    tooltipBoxStyle() {
      return {
        transform: 'translateX(calc(-50% + ' + this.tooltipPos.shiftX + 'px))'
      };
    }
  },

  beforeDestroy() {
    this.cancelHide();
  },

  methods: {
    segOf(bar) {
      return {
        index: bar.index,
        label: bar.label,
        value: bar.value,
        displayValue: bar.displayValue,
        kind: bar.kind
      };
    },

    formatValueText(value, displayValue, index, isPreview) {
      const hasFmt = typeof this.formatter === 'function';
      if (isPreview) {
        const body = hasFmt
          ? this.formatter(displayValue, index)
          : String(Math.round(displayValue));
        return '~' + body;
      }
      if (hasFmt) return this.formatter(value, index);
      return value === null || value === undefined ? '—' : String(value);
    },

    formatTickLabel(value, index, label) {
      // labels 优先;无 label 时用 formatter 兜出轴文案,再退到索引。
      if (this.labels[index] != null && this.labels[index] !== '') return label;
      if (typeof this.formatter === 'function') {
        return this.formatter(value === undefined ? null : value, index);
      }
      return label;
    },

    handleColEnter(bar, event) {
      this.cancelHide();
      this.hoverBar = bar;

      const plot = this.$refs.plot;
      if (!plot) return;

      // 以柱体实体定位,避免列 hover 引导条把 top 顶高。
      const col = event.currentTarget;
      const barEl = col.querySelector('.rumo-trend-chart__bar');
      const rect = (barEl || col).getBoundingClientRect();
      const containerRect = plot.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top;

      let shiftX = 0;
      if (x < TOOLTIP_HALF_WIDTH) {
        shiftX = TOOLTIP_HALF_WIDTH - x;
      } else if (x > containerRect.width - TOOLTIP_HALF_WIDTH) {
        shiftX = (containerRect.width - TOOLTIP_HALF_WIDTH) - x;
      }

      // 顶部空间不足时向下翻转,避免被图容器裁切。
      const flipDown = y < TOOLTIP_EST_HEIGHT + 12;

      this.tooltipPos = {
        x: x,
        y: y,
        shiftX: shiftX,
        flipDown: flipDown
      };
    },

    handleColLeave() {
      this.scheduleHide();
    },

    scheduleHide() {
      const self = this;
      this.cancelHide();
      this.hideTimer = setTimeout(function() {
        self.hoverBar = null;
        self.hideTimer = null;
      }, HIDE_DELAY_MS);
    },

    cancelHide() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    }
  }
};
</script>
