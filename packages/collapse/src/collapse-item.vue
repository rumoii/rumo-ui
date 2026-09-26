<template>
  <div class="rumo-collapse-item" :class="{ 'is-active': isActive, 'is-disabled': disabled }">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`rumo-collapse-content-${id}`"
      :aria-describedby ="`rumo-collapse-content-${id}`"
    >
      <div
        class="rumo-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`rumo-collapse-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{'focusing': focusing}"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <i v-if="showArrow" class="rumo-collapse-item__arrow rumo-icons icon-right-line"></i>
        <slot name="title">{{title}}</slot>
      </div>
    </div>
    <rumo-collapse-transition>
      <div
        class="rumo-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`rumo-collapse-head-${id}`"
        :id="`rumo-collapse-content-${id}`"
      >
        <div class="rumo-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </rumo-collapse-transition>
  </div>
</template>
<script>
  import RumoCollapseTransition from 'rumo-ui/src/transitions/collapse-transition';
  import Emitter from 'rumo-ui/src/mixins/emitter';
  import { generateId } from 'rumo-ui/src/utils/util';

  export default {
    name: 'RumoCollapseItem',

    componentName: 'RumoCollapseItem',

    mixins: [Emitter],

    components: { RumoCollapseTransition },

    data() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0,
        focusing: false,
        isClick: false
      };
    },

    inject: ['collapse'],

    props: {
      title: String,
      name: {
        type: [String, Number],
        default() {
          return this._uid;
        }
      },
      disabled: Boolean,
      showArrow: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      isActive() {
        return this.collapse.activeNames.indexOf(this.name) > -1;
      },
      id() {
        return generateId();
      }
    },

    methods: {
      handleFocus() {
        setTimeout(() => {
          if (!this.isClick) {
            this.focusing = true;
          } else {
            this.isClick = false;
          }
        }, 50);
      },
      handleHeaderClick() {
        if (this.disabled) return;
        this.dispatch('RumoCollapse', 'item-click', this);
        this.focusing = false;
        this.isClick = true;
      },
      handleEnterClick() {
        this.dispatch('RumoCollapse', 'item-click', this);
      }
    }
  };
</script>
