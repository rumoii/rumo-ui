<template>
  <div class="rumo-skeleton__item" :class="'rumo-skeleton__' + variant">
    <rumo-icon v-if="variant === 'image'" name="picture" />
  </div>
</template>
<script>
// Derived from element-plus/packages/components/skeleton/src/{skeleton-item.vue,skeleton-item.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
export default {
  name: 'RumoSkeletonItem',
  props: { variant: { type: String, default: 'text' } }
};
</script>
