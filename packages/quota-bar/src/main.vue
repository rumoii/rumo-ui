<template>
  <div class="rumo-quota-bar" @click="$emit('click', $event)">
    <div class="rumo-quota-bar__head">
      <span class="rumo-quota-bar__label">
        <slot name="label">{{ label }}</slot>
      </span>
      <span class="rumo-quota-bar__meta">
        <span v-if="valueDisplay" class="rumo-quota-bar__value rumo-num">{{ valueDisplay }}</span>
        <span v-if="showPercent" class="rumo-quota-bar__percent rumo-num">{{ percentDisplay }}</span>
        <span v-if="resetAt" class="rumo-quota-bar__reset">{{ resetAt }}</span>
        <slot name="actions"></slot>
      </span>
    </div>

    <div
      class="rumo-quota-bar__track"
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="clampedPercent"
    >
      <div
        class="rumo-quota-bar__fill"
        :class="'rumo-quota-bar__fill--' + toneClass"
        :style="fillStyle"
      ></div>
      <template v-if="hasPace">
        <!-- 缺口:一段裸轨道切开填充,标记在同色填充上也能看清 -->
        <div
          class="rumo-quota-bar__pace-notch"
          :style="paceNotchStyle"
        ></div>
        <div
          class="rumo-quota-bar__pace-mark"
          :class="{ 'rumo-quota-bar__pace-mark--over': paceOver }"
          :style="paceMarkStyle"
        ></div>
      </template>
    </div>
  </div>
</template>

<script>
var TONE_SUCCESS = 'success';
var TONE_WARNING = 'warning';
var TONE_DANGER = 'danger';

export default {
  name: 'RumoQuotaBar',

  props: {
    // 左侧标签文案
    label: {
      type: String,
      default: ''
    },
    // 右侧数值(用量或剩余量,与 mode 语义一致);valueText 优先
    value: {
      type: [Number, String],
      default: null
    },
    // 右侧数值文案,缺省显示 value
    valueText: {
      type: String,
      default: ''
    },
    // 展示百分比 0-100:used 模式为已用比例,remain 模式为剩余比例
    percent: {
      type: Number,
      default: 0
    },
    // used 正向填充(已用);remain 剩余量语义(高值为佳)
    mode: {
      type: String,
      default: 'used',
      validator: function(v) {
        return v === 'used' || v === 'remain';
      }
    },
    // 重置时间文案,由使用方传入已格式化字符串;空则不显示
    resetAt: {
      type: String,
      default: ''
    },
    // 配速标记位置 0-100;null 不显示
    pacePercent: {
      type: Number,
      default: null
    },
    // 阈值色:缺省按用量风险自动(<80 success,80-95 warning,>95 danger)
    tone: {
      type: String,
      default: '',
      validator: function(v) {
        return v === '' || v === TONE_SUCCESS || v === TONE_WARNING || v === TONE_DANGER;
      }
    },
    showPercent: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    clampedPercent: function() {
      var p = Number(this.percent);
      if (!isFinite(p)) p = 0;
      return Math.max(0, Math.min(100, p));
    },
    roundedPercent: function() {
      return Math.round(this.clampedPercent);
    },
    // 源码细节:<1% 不塌成 0%,文案与填充都保留可见量
    subOnePercent: function() {
      return this.clampedPercent > 0 && this.roundedPercent === 0;
    },
    percentDisplay: function() {
      return (this.subOnePercent ? '<1' : String(this.roundedPercent)) + '%';
    },
    valueDisplay: function() {
      if (this.valueText) return this.valueText;
      if (this.value === null || this.value === undefined || this.value === '') return '';
      return String(this.value);
    },
    // 用量风险:remain 模式下比例含义翻转(剩余越少风险越高)
    riskPercent: function() {
      return this.mode === 'remain' ? 100 - this.clampedPercent : this.clampedPercent;
    },
    toneClass: function() {
      if (this.tone === TONE_SUCCESS || this.tone === TONE_WARNING || this.tone === TONE_DANGER) {
        return this.tone;
      }
      if (this.riskPercent > 95) return TONE_DANGER;
      if (this.riskPercent >= 80) return TONE_WARNING;
      return TONE_SUCCESS;
    },
    fillStyle: function() {
      var width = this.subOnePercent ? Math.max(this.clampedPercent, 0.35) : this.clampedPercent;
      return {
        width: width + '%',
        minWidth: this.clampedPercent > 0 ? '3px' : '0'
      };
    },
    hasPace: function() {
      return this.pacePercent !== null && this.pacePercent !== undefined && isFinite(Number(this.pacePercent));
    },
    paceX: function() {
      return Math.max(0, Math.min(100, Number(this.pacePercent) || 0));
    },
    // 超前配速:used 下填充越过标记,remain 下剩余低于标记
    paceOver: function() {
      return this.mode === 'remain'
        ? this.clampedPercent < this.paceX
        : this.clampedPercent > this.paceX;
    },
    paceNotchStyle: function() {
      return {
        left: 'calc(' + this.paceX + '% - 3px)',
        width: '6px'
      };
    },
    paceMarkStyle: function() {
      return {
        left: 'calc(' + this.paceX + '% - 1px)',
        width: '2px'
      };
    }
  }
};
</script>
