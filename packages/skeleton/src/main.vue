<template>
  <div class="rumo-skeleton" :class="{ 'is-animated': animated && uiLoading }">
    <template v-if="uiLoading">
      <template v-for="index in count">
        <div :key="index" class="rumo-skeleton__section">
          <slot name="template"><rumo-skeleton-item variant="p" class="is-first" />
            <rumo-skeleton-item v-for="row in rows" :key="row" variant="p"
              :class="{ 'is-last': row === rows && rows > 1 }" />
          </slot>
        </div>
      </template>
    </template>
    <slot v-else></slot>
  </div>
</template>
<script>
// Derived from element-plus/packages/components/skeleton/src/{skeleton.vue,skeleton.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import SkeletonItem from './skeleton-item';
export default {
  name: 'RumoSkeleton', components: { RumoSkeletonItem: SkeletonItem },
  props: { animated: Boolean, count: { type: Number, default: 1 }, rows: { type: Number, default: 3 },
    loading: { type: Boolean, default: true }, throttle: [Number, Object] },
  data() { return { uiLoading: this.loading, throttleTimer: null }; },
  watch: { loading() { this.syncLoading(); }, throttle: { handler() { this.syncLoading(); }, deep: true } },
  beforeDestroy() { this.clearThrottle(); },
  methods: {
    clearThrottle() { if (this.throttleTimer !== null) { clearTimeout(this.throttleTimer); this.throttleTimer = null; } },
    syncLoading() {
      this.clearThrottle();
      const delay = typeof this.throttle === 'number' ? this.throttle :
        this.throttle && this.throttle[this.loading ? 'leading' : 'trailing'];
      if (!delay || delay < 0) { this.uiLoading = this.loading; return; }
      this.throttleTimer = setTimeout(() => { this.uiLoading = this.loading; this.throttleTimer = null; }, delay);
    }
  }
};
</script>
