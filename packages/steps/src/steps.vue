<template>
  <div class="rumo-steps" :class="[
       !simple && 'rumo-steps--' + direction,
       simple && 'rumo-steps--simple'
     ]">
    <slot></slot>
  </div>
</template>

<script>
import Migrating from 'rumo-ui/src/mixins/migrating';

export default {
  name: 'RumoSteps',

  mixins: [Migrating],

  props: {
    space: [Number, String],
    type: {
      type: String,
      default: 'line'
    },
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },

  data() {
    return {
      steps: [],
      stepOffset: 0
    };
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'center': 'center is removed.'
        }
      };
    }
  },

  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
    }
  }
};
</script>
