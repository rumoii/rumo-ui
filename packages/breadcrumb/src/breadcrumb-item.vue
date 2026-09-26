<template>
  <span class="rumo-breadcrumb__item">
    <span :class="['rumo-breadcrumb__inner', to ? 'is-link' : '']"
      ref="link"
      role="link">
      <slot></slot>
    </span>
    <i v-if="separatorClass"
      class="rumo-breadcrumb__separator"
      :class="separatorClass"></i>
    <span v-else
      class="rumo-breadcrumb__separator"
      role="presentation">{{separator}}</span>
  </span>
</template>
<script>
export default {
  name: 'RumoBreadcrumbItem',
  props: {
    to: {},
    replace: Boolean
  },
  data() {
    return {
      separator: '',
      separatorClass: ''
    };
  },

  inject: ['rumoBreadcrumb'],

  mounted() {
    this.separator = this.rumoBreadcrumb.separator;
    this.separatorClass = this.rumoBreadcrumb.separatorClass;
    if (this.to) {
      let link = this.$refs.link;
      let to = this.to;
      link.setAttribute('role', 'link');
      link.addEventListener('click', _ => {
        this.replace ? this.$router.replace(to)
          : this.$router.push(to);
      });
    }
  }
};
</script>
