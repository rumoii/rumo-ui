<template>
  <transition 
    :name="transition"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div class="rumo-dialog__wrapper"
      :class="[$RUMO.namespaceClass]"
      v-show="visible"
      @click.self="handleWrapperClick">
      <div class="rumo-dialog"
        :class="[{ 'is-fullscreen': fullscreen, 'rumo-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="rumo-dialog__header">
          <slot name="title">
            <span class="rumo-dialog__title">{{ title }}</span>
          </slot>
          <button type="button"
            class="rumo-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="rumo-dialog__close rumo-icon rumo-icons icon-close rumo-icons-18"></i>
          </button>
        </div>
        <rumo-scrollbar :style="{ height: height }" v-if="height">
          <div class="rumo-dialog__body" v-if="rendered">
            <slot></slot>
          </div>
        </rumo-scrollbar>
        <div class="rumo-dialog__body" v-if="rendered && !height">
          <slot></slot>
        </div>
        <div class="rumo-dialog__footer"
          v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'rumo-ui/src/utils/popup';
import Migrating from 'rumo-ui/src/mixins/migrating';
import emitter from 'rumo-ui/src/mixins/emitter';
import PopupManager from 'rumo-ui/src/utils/popup/popup-manager';

export default {
  name: 'RumoDialog',

  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: false
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: 'rumo-zoom-in'
    },
    height: {
      type: String,
      default: null
    },
  },

  data() {
    return {
      closed: false
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          const popupContainer = PopupManager.getPopupContainer();
          popupContainer.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
      }
    }
  },

  computed: {
    style() {
      let style = {};
      if (this.width) {
        style.width = this.width;
      }
      if (!this.fullscreen) {
        style.marginTop = this.top;
      }
      return style;
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'size': 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast('RumoSelectDropdown', 'updatePopper');
      this.broadcast('RumoDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        const popupContainer = PopupManager.getPopupContainer();
        popupContainer.appendChild(this.$el);
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
