<template>
  <transition name="rumo-message-fade">
    <div :class="[
        $RUMO.namespaceClass,
        'rumo-message',
        type && !iconClass ? `rumo-message--${ type }` : '',
        variant ? `rumo-message--variant-${ variant }` : '',
        variant ? 'rumo-dash' : '',
        variant && dark ? 'is-dark' : '',
        center ? 'is-center' : '',
        customClass]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert">
      <i :class="iconClass"
        v-if="iconClass"></i>
      <i :class="typeClass"
        v-else></i>
      <p class="rumo-message__content">
        <slot>
          <p v-if="!dangerouslyUseHTMLString"
            :class="[
            'rumo-message__content',
            showClose ? 'show-close' : ''
          ]">{{ message }}</p>
          <p v-else
            v-html="message"
            :class="[
            'rumo-message__content',
            showClose ? 'show-close' : ''
          ]"></p>
        </slot>
      </p>

      <span :class="['rumo-message__beforeClose', showClose ? 'show-close' : '']">
        <slot name="beforeCloseSlot">
          {{ beforeCloseSlot }}
        </slot>
      </span>

      <i v-if="showClose"
        class="rumo-message__closeBtn rumo-icons icon-close rumo-icons-14"
        @click="close"></i>
    </div>
  </transition>
</template>

<script type="text/babel">
const typeMap = {
  success: 'check-fill',
  info: 'info-fill',
  warning: 'warning-fill',
  error: 'close-fill'
};

export default {
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false,
      variant: '',
      dark: false,
      beforeCloseSlot: ''
    };
  },

  computed: {
    iconWrapClass() {
      const classes = ['rumo-message__icon'];
      if (this.type && !this.iconClass) {
        classes.push(`rumo-message__icon--${this.type}`);
      }
      return classes;
    },

    typeClass() {
      return this.type && !this.iconClass
        ? `rumo-message__icon rumo-icons icon-${typeMap[this.type]}`
        : '';
    },

    positionStyle() {
      return {
        'top': `${ this.verticalOffset }px`
      };
    }
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.destroyElement);
      }
    }
  },

  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },

    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      if (e.keyCode === 27) { // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    }
  },
  mounted() {
    this.startTimer();
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  }
};
</script>
