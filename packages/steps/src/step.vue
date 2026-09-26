<template>
  <div class="rumo-step" :style="style" :class="[
      !isSimple && `is-${$parent.direction}`,
      isSimple && 'is-simple',
      isLast && !space && !isCenter && 'is-flex',
      `is-${type}`,
      `is-${currentStatus}`,
      isCenter && !isVertical && !isSimple && 'is-center'
     ]">
    <!-- icon & line -->
    <div class="rumo-step__head" :class="`is-${currentStatus} is-${type}`">
      <div :class="`rumo-step__${type}`" :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }">
        <i class="rumo-step__line-inner" :style="lineStyle"></i>
      </div>

      <div class="rumo-step__icon" :class="`is-${icon ? 'icon' : 'text'}`" @click="handleStepClick(index)">
        <slot v-if="currentStatus !== 'success' && currentStatus !== 'error'" name="icon">
          <i v-if="icon" class="rumo-step__icon-inner" :class="[icon]"></i>
          <div class="rumo-step__icon-inner" v-if="!icon && !isSimple">{{ index + 1 }}</div>
        </slot>
        <i v-else :class="['icon-' + (currentStatus === 'success' ? 'check' : 'close')]" class="rumo-icons rumo-step__icon-inner is-status">
        </i>
      </div>
      <!-- title & description -->
      <div class="rumo-step__main">
        <div class="rumo-step__title" ref="title" :class="['is-' + currentStatus]" @click="handleStepClick(index)">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="isSimple"></div>
        <div v-else class="rumo-step__description" :class="['is-' + currentStatus]">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
      <div v-if="isSimple" class="rumo-step__arrow"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RumoStep',

  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    };
  },

  beforeCreate() {
    this.$parent.steps.push(this);
  },

  beforeDestroy() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },

  computed: {
    type() {
      return this.$parent.type;
    },
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical() {
      return this.$parent.direction === 'vertical';
    },
    isSimple() {
      return this.$parent.simple;
    },
    isLast() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    stepsCount() {
      return this.$parent.steps.length;
    },
    space() {
      const { isSimple, $parent: { space } } = this;
      return isSimple ? '' : space;
    },
    style: function() {
      const style = {};
      const parent = this.$parent;
      const len = parent.steps.length;

      const space = (typeof this.space === 'number'
        ? this.space + 'px'
        : this.space
          ? this.space
          : 100 / (len - 1) + '%');
      style.flexBasis = space;
      if (this.isVertical) return style;
      if (this.isLast) {
        style.maxWidth = 100 / this.stepsCount + '%';
      } else {
        style.marginRight = -this.$parent.stepOffset + 'px';
      }
      if (this.$parent.type === 'tail') {
        style.paddingRight = '0px';
      }
      return style;
    }
  },

  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },

    calcProgress(status) {
      let step = 100;
      const style = {};

      style.transitionDelay = 150 * this.index + 'ms';
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 0 : 0;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = (-150 * this.index) + 'ms';
      }

      style.borderWidth = step ? '1px' : 0;
      this.$parent.direction === 'vertical'
        ? style.height = step + '%'
        : style.width = step + '%';

      this.lineStyle = style;
    },
    handleStepClick(index) {
      this.$emit('step-click', index)
    }
  },

  mounted() {
    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true });
      unwatch();
    });
  }
};
</script>
