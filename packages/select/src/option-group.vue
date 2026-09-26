<template>
  <ul class="rumo-select-group__wrap" v-show="visible">
    <li class="rumo-select-group__title">{{ label }}</li>
    <li>
      <ul class="rumo-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
import Emitter from 'rumo-ui/src/mixins/emitter';

export default {
  mixins: [Emitter],

  name: 'RumoOptionGroup',

  componentName: 'RumoOptionGroup',

  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: true
    };
  },

  watch: {
    disabled(val) {
      this.broadcast('RumoOption', 'handleGroupDisabled', val);
    }
  },

  methods: {
    queryChange() {
      this.visible = this.$children &&
        Array.isArray(this.$children) &&
        this.$children.some(option => option.visible === true);
    }
  },

  created() {
    this.$on('queryChange', this.queryChange);
  },

  mounted() {
    if (this.disabled) {
      this.broadcast('RumoOption', 'handleGroupDisabled', this.disabled);
    }
  }
};
</script>
