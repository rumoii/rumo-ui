<template>
  <transition
    name="rumo-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div
      class="rumo-drawer__wrapper"
      tabindex="-1"
      v-show="visible">
      <div
        class="rumo-drawer__container"
        :class="visible && 'rumo-drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1">
        <div
          aria-modal="true"
          aria-labelledby="rumo-drawer__title"
          :aria-label="title"
          class="rumo-drawer"
          :class="[direction, customClass, $RUMO.namespaceClass]"
          :style="isHorizontal ? `width: ${size}` : `height: ${size}`"
          ref="drawer"
          role="dialog"
          tabindex="-1"
          >
          <header class="rumo-drawer__header" id="rumo-drawer__title" v-if="withHeader">
            <slot name="title">
              <span role="heading" tabindex="0" :title="title">{{ title }}</span>
            </slot>
            <button
              :aria-label="`close ${title || 'drawer'}`"
              class="rumo-drawer__close-btn"
              type="button"
              v-if="showClose"
              @click="closeDrawer">
              <i class="rumo-dialog__close rumo-icons icon-close rumo-icons-18"></i>
            </button>
          </header>
          <section class="rumo-drawer__body" :style="{ display: isFlexLayout ? 'flex' : '' }" v-if="rendered">
            <slot></slot>
          </section>
        </div> 
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'rumo-ui/src/utils/popup';
import emitter from 'rumo-ui/src/mixins/emitter';
import Utils from 'rumo-ui/src/utils/aria-utils';
import PopupManager from 'rumo-ui/src/utils/popup/popup-manager';

export default {
  name: 'RumoDrawer',
  mixins: [Popup, emitter],
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    beforeClose: {
      type: Function
    },
    customClass: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'rtl',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1;
      }
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '30%'
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    flexLayout: {
      type: Boolean,
      default: null
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr';
    },
    isFlexLayout() {
      return (this.flexLayout !== null && this.flexLayout !== undefined) ? this.flexLayout : this.$RUMO.drawer.flexLayout
    }
  },
  data() {
    return {
      closed: false,
      prevActiveElement: null
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        if (this.appendToBody) {
          const popupContainer = PopupManager.getPopupContainer();
          popupContainer.appendChild(this.$el);
        }
        this.prevActiveElement = document.activeElement;
        this.$nextTick(() => {
          Utils.focusFirstDescendant(this.$refs.drawer);
        });
      } else {
        if (!this.closed) this.$emit('close');
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus();
          }
        });
      }
    }
  },
  methods: {
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        if (this.destroyOnClose === true) {
          this.rendered = false;
        }
        this.closed = true;
      }
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer();
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    handleClose() {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      this.closeDrawer();
    }
  },
  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
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
