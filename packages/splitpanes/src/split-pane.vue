<template>
  <div class="rumo-splitpanes__pane" :style="paneStyle" @click="onClick"><slot></slot></div>
</template>
<script>
// Derived from splitpanes@v2.4.1/src/components/splitpanes/pane.vue (MIT) — https://github.com/antoniandre/splitpanes @c668ab3b2517e59201e613c198381443bf43c2b6
export default {
  name: 'RumoSplitPane',
  componentName: 'RumoSplitPane',
  inject: { rumoSplitpanes: { default: null } },
  props: {
    size: { type: [Number, String], default: null },
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 100 }
  },
  data() { return { paneStyle: {} }; },
  watch: {
    size() { this.notifyParent(true); },
    min() { this.notifyParent(); },
    max() { this.notifyParent(); }
  },
  mounted() { if (this.rumoSplitpanes) this.rumoSplitpanes.onPaneAdd(this); },
  beforeDestroy() { if (this.rumoSplitpanes) this.rumoSplitpanes.onPaneRemove(this); },
  methods: {
    notifyParent(changedSize) { if (this.rumoSplitpanes) this.rumoSplitpanes.onPaneChange(this, changedSize); },
    onClick() {
      if (!this.rumoSplitpanes) return;
      const pane = this.rumoSplitpanes.panes.find(item => item.vm === this);
      if (pane) this.rumoSplitpanes.$emit('pane-click', Object.assign({}, this.rumoSplitpanes.limits(pane), { size: pane.size }));
    }
  }
};
</script>
