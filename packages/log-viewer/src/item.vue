<template>
  <div class="rumo-log-viewer__row" :class="{ 'is-wrap': wrap }">
    <span v-if="showLineNumber" class="rumo-log-viewer__line-number">{{ source.lineNumber }}</span>
    <span class="rumo-log-viewer__line-content" v-html="source.html"></span>
  </div>
</template>

<script>
export default {
  name: 'RumoLogViewerItem',
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default() {
        return {};
      }
    },
    wrap: {
      type: Boolean,
      default: false
    },
    showLineNumber: {
      type: Boolean,
      default: true
    }
  }
};
</script>
