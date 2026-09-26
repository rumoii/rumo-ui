<template>
  <aside class="rumo-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'RumoAside',

    componentName: 'RumoAside',

    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
