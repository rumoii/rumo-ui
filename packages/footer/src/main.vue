<template>
  <footer class="rumo-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'RumoFooter',

    componentName: 'RumoFooter',

    props: {
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
