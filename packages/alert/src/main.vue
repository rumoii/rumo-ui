<template>
  <transition name="rumo-alert-fade">
    <div class="rumo-alert" :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]" v-show="visible" role="alert">
      <i class="rumo-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="rumo-alert__content">
        <span class="rumo-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <slot>
          <p class="rumo-alert__description" v-if="description">{{ description }}</p>
        </slot>
        <i class="rumo-alert__closebtn rumo-icons-18" :class="{ 'is-customed': closeText !== '', 'rumo-icons icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
const TYPE_CLASSES_MAP = {
  'success': 'rumo-icons icon-check-fill',
  'warning': 'rumo-icons icon-warning-fill',
  'error': 'rumo-icons icon-close-fill'
};
export default {
  name: 'RumoAlert',

  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ''
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function(value) {
        return ['light', 'dark'].indexOf(value) !== -1;
      }
    }
  },

  data() {
    return {
      visible: true
    };
  },

  methods: {
    close() {
      this.visible = false;
      this.$emit('close');
    }
  },

  computed: {
    typeClass() {
      return `rumo-alert--${this.type}`;
    },

    iconClass() {
      return TYPE_CLASSES_MAP[this.type] || 'rumo-icons icon-info-fill';
    },

    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : '';
    },

    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : '';
    }
  }
};
</script>
