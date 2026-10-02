<template>
  <div class="rumo-stat-tile">
    <div v-if="$slots.icon" class="rumo-stat-tile__icon">
      <slot name="icon"></slot>
    </div>

    <div class="rumo-stat-tile__value rumo-num" :title="hint || null">
      <span v-if="loading" class="rumo-stat-tile__skeleton"></span>
      <slot v-else>{{ displayValue }}</slot>
    </div>

    <div class="rumo-stat-tile__label" :title="hint || null">
      <slot name="label">{{ label }}</slot>
    </div>

    <div
      v-if="!loading && delta"
      class="rumo-stat-tile__delta"
      :class="toneClass"
    >{{ delta }}</div>
  </div>
</template>

<script>
export default {
  name: 'RumoStatTile',

  props: {
    // 指标名称
    label: {
      type: String,
      default: ''
    },
    // 指标数值;default 插槽可整体替换该区域
    value: {
      type: [String, Number],
      default: ''
    },
    // tooltip 文案,挂在数值与标签上
    hint: {
      type: String,
      default: ''
    },
    // 环比/变化文案,如 "+12%"
    delta: {
      type: String,
      default: ''
    },
    // delta 着色;空串用默认中性色
    tone: {
      type: String,
      default: '',
      validator: function(v) {
        return v === '' || v === 'success' || v === 'warning' || v === 'danger';
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    displayValue() {
      if (this.value === null || this.value === undefined || this.value === '') return '—';
      return String(this.value);
    },
    toneClass() {
      return this.tone ? 'rumo-stat-tile__delta--' + this.tone : '';
    }
  }
};
</script>
