<template>
  <div class="rumo-tab-pane"
    v-if="(!lazy || loaded) || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'RumoTabPane',

  componentName: 'RumoTabPane',

  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean
  },

  data() {
    return {
      index: null,
      loaded: false
    };
  },

  computed: {
    isClosable() {
      return typeof this.closable === 'boolean' ? this.closable : this.$parent.closable;
    },
    active() {
      const active = this.$parent.currentName === (this.name || this.index);
      if (active) {
        this.loaded = true;
      }
      return active;
    },
    paneName() {
      return this.name || this.index;
    }
  },

  mounted() {
    this.$parent.addPanes(this);
  },

  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$parent.removePanes(this);
  },

  watch: {
    label() {
      this.$parent.$forceUpdate();
    }
  }
};
</script>
