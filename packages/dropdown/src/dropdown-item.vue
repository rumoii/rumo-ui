<template>
  <li
    class="rumo-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'rumo-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <i :class="'rumo-icons ' + icon" v-if="icon"></i>
    <slot></slot>
  </li>
</template>
<script>
  import Emitter from 'rumo-ui/src/mixins/emitter';

  export default {
    name: 'RumoDropdownItem',

    mixins: [Emitter],

    props: {
      command: {},
      disabled: Boolean,
      divided: Boolean,
      icon: String
    },

    methods: {
      handleClick(e) {
        this.dispatch('RumoDropdown', 'menu-item-click', [this.command, this]);
      }
    }
  };
</script>
