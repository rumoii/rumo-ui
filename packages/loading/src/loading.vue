<template>
  <transition name="rumo-loading-fade"
    @after-leave="handleAfterLeave">
    <div v-show="visible"
      class="rumo-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]"
      ref="loadingMask">
      <div class="rumo-loading-spinner">
        <slot>
          <svg v-if="!spinner"
            class="circular"
            viewBox="25 25 50 50">
            <circle class="path"
              cx="50"
              cy="50"
              r="20"
              fill="none" />
          </svg>
          <i v-else
            :class="spinner"></i>
          <p v-if="text"
            class="rumo-loading-text">{{ text }}</p>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { preventScroll } from 'rumo-ui/src/utils/dom';

export default {
  data() {
    return {
      text: null,
      spinner: null,
      background: null,
      fullscreen: true,
      visible: false,
      preventScroll: false,
      customClass: ''
    };
  },

  mounted() {
    // console.log('loadin.vue ', typeof this.preventScroll, this.preventScroll);
    this.preventScroll && preventScroll(this.$refs.loadingMask);
  },

  methods: {
    handleAfterLeave() {
      this.$emit('after-leave');
    },
    setText(text) {
      this.text = text;
    }
  }
};
</script>
