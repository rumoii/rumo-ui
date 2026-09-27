<template>
  <span class="rumo-check-tag" :class="['rumo-check-tag--' + type, { 'is-checked': checked, 'is-disabled': disabled }]"
    role="checkbox" :aria-checked="String(checked)" :aria-disabled="String(disabled)" :tabindex="disabled ? -1 : 0"
    @click="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle"><slot></slot></span>
</template>
<script>
// Derived from element-plus/packages/components/check-tag/src/{check-tag.vue,check-tag.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
export default {
  name: 'RumoCheckTag',
  props: { checked: Boolean, disabled: Boolean, type: { type: String, default: 'primary' } },
  methods: {
    toggle() {
      if (this.disabled) return;
      this.$emit('update:checked', !this.checked);
      this.$emit('change', !this.checked);
    }
  }
};
</script>
