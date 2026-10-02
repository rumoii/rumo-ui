<template>
  <div class="rumo-insight-card" :class="{ 'is-loading': loading }">
    <div class="rumo-insight-card__header">
      <slot name="title">{{ title }}</slot>
    </div>

    <div class="rumo-insight-card__body">
      <div v-if="loading" class="rumo-insight-card__loading" role="status" aria-live="polite">
        <div v-for="n in 3" :key="n" class="rumo-insight-card__placeholder"></div>
      </div>

      <ul v-else class="rumo-insight-card__list">
        <li
          v-for="item in normalized"
          :key="item.key"
          class="rumo-insight-card__item"
          @click="$emit('insight-click', item.raw)"
        >
          <span v-if="$slots.icon" class="rumo-insight-card__icon">
            <slot name="icon" :insight="item.raw"></slot>
          </span>
          <span class="rumo-insight-card__label">{{ item.label }}</span>
          <span
            v-if="item.delta"
            class="rumo-insight-card__delta"
            :class="item.toneClass"
          >{{ item.delta }}</span>
          <span class="rumo-insight-card__value rumo-num">{{ item.displayValue }}</span>
        </li>
      </ul>
    </div>

    <div v-if="$slots.footer" class="rumo-insight-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
var TONE_SUCCESS = 'success';
var TONE_WARNING = 'warning';
var TONE_DANGER = 'danger';

export default {
  name: 'RumoInsightCard',

  props: {
    // 卡片标题;title 插槽存在时优先用插槽
    title: {
      type: String,
      default: ''
    },
    // 要点列表:{ label, value, delta?, tone? },tone 仅着色 delta
    insights: {
      type: Array,
      default() {
        return [];
      }
    },
    // 加载态:渲染占位骨架,不渲染列表
    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    normalized() {
      return this.insights.map(function(item, idx) {
        var src = item || {};
        var tone = src.tone || '';
        var validTone = tone === TONE_SUCCESS || tone === TONE_WARNING || tone === TONE_DANGER;
        return {
          key: idx,
          label: src.label != null ? String(src.label) : '',
          displayValue: src.value != null ? String(src.value) : '',
          delta: src.delta != null && src.delta !== '' ? String(src.delta) : '',
          toneClass: validTone ? 'rumo-insight-card__delta--' + tone : '',
          raw: src
        };
      });
    }
  }
};
</script>
