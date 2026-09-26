<template>
  <li class="rumo-timeline-item">
    <div class="rumo-timeline-item__tail"></div>

    <div v-if="!$slots.dot"
      class="rumo-timeline-item__node"
      :class="[
        `rumo-timeline-item__node--${size || ''}`,
        `rumo-timeline-item__node--${type || ''}`
      ]"
      :style="{
        backgroundColor: color
      }"
    >
      <i v-if="icon"
        class="rumo-timeline-item__icon"
        :class="'rumo-icons ' + icon"
      ></i>
    </div>
    <div v-if="$slots.dot" class="rumo-timeline-item__dot">
      <slot name="dot"></slot>
    </div>

    <div class="rumo-timeline-item__wrapper">
      <div v-if="!hideTimestamp && placement === 'top'"
        class="rumo-timeline-item__timestamp is-top">
        <slot name="timestamp">{{timestamp}}</slot>
      </div>

      <div class="rumo-timeline-item__content">
        <slot></slot>
      </div>

      <div v-if="!hideTimestamp && placement === 'bottom'"
        class="rumo-timeline-item__timestamp is-bottom">
        <slot name="timestamp">{{timestamp}}</slot>
      </div>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'RumoTimelineItem',

    inject: ['timeline'],

    props: {
      timestamp: String,

      hideTimestamp: {
        type: Boolean,
        default: false
      },

      placement: {
        type: String,
        default: 'bottom'
      },

      type: String,

      color: String,

      size: {
        type: String,
        default: 'normal'
      },

      icon: String
    }
  };
</script>
