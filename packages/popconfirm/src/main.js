import Popper from 'rumo-ui/src/utils/vue-popper';
import debounce from 'throttle-debounce/debounce';
import Locale from 'rumo-ui/src/mixins/locale';
import { addClass, removeClass, on, off } from 'rumo-ui/src/utils/dom';
import { getFirstComponentChild } from 'rumo-ui/src/utils/vdom';
import { generateId } from 'rumo-ui/src/utils/util';
import Vue from 'vue';

export default {
  name: 'RumoPopconfirm',
  mixins: [Locale, Popper],
  props: {
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    popperClass: String,
    content: String,
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'rumo-zoom-in'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    },
    enterable: {
      type: Boolean,
      default: true
    },
    hideAfter: {
      type: Number,
      default: 0
    },
    placement: {
      type: String,
      default: 'top'
    },
    trigger: {
      type: String,
      default: 'click'
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 200
    },
    size: {
      type: String,
      default: 'mini'
    },
    icon: {
      type: String,
      default: 'warning-fill'
    },
    buttonStyle: {
      default: function() {
        return {};
      }
    },
    buttonText: {
      type: String,
      default: '操作'
    },
    onConfirm: {
      type: Function,
      default: function() { }
    },
    onCancel: {
      type: Function,
      default: function() { }
    },
    confirmText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPopper: false,
      timeoutPending: null,
      focusing: false
    };
  },
  computed: {
    tooltipId() {
      return `rumo-popconfirm-${generateId()}`;
    }
  },
  beforeCreate() {
    if (this.$isServer) return;

    this.popperVM = new Vue({
      data: { node: '' },
      render(h) {
        return this.node;
      }
    }).$mount();

    this.debounceClose = debounce(200, () => this.handleClosePopper());
  },

  render(h) {
    if (this.popperVM) {
      this.popperVM.node = (
        <transition
          name={this.transition}
          onAfterLeave={this.doDestroy}>
          <div
            onMouseleave={() => { if (this.trigger !== 'click') { this.setExpectedState(false); this.debounceClose(); } }}
            onMouseenter={() => { if (this.trigger !== 'click') { this.setExpectedState(true); } }}
            ref="popper"
            role="tooltip"
            id={this.tooltipId}
            aria-hidden={(this.disabled || !this.showPopper) ? 'true' : 'false'}
            v-show={!this.disabled && this.showPopper}
            style={this.width ? 'width:' + this.width + 'px' : ''}
            class={
              [this.$RUMO.namespaceClass, 'rumo-popover rumo-popper', 'is-' + this.effect, this.popperClass]
            }>
            <div class="rumo-popover__title" v-show={this.title}>
              {this.title}
            </div>
            <div class="rumo-popover__message">
              <span v-show={!this.$slots.default && !this.$slots.message}><rumo-icon name={this.icon}></rumo-icon>&nbsp;</span>
              {this.$slots.message || this.$slots.default || this.content}
            </div>
            <div class="rumo-popover__buttons">
              <rumo-button
                onClick={this.handleCancel}
                size={this.size}>
                {this.cancelText || this.t('rumo.popconfirm.cancel')}
              </rumo-button>
              <rumo-button
                onClick={this.handleConfirm}
                size={this.size}
                type="primary">
                {this.confirmText || this.t('rumo.popconfirm.confirm')}
              </rumo-button>
            </div>
          </div>
        </transition>);
    }

    if (!this.$slots.reference || !this.$slots.reference.length) return this.$slots.reference;

    const vnode = getFirstComponentChild(this.$slots.reference);

    if (!vnode) return vnode;

    const data = vnode.data = vnode.data || {};
    data.staticClass = this.concatClass(data.staticClass, 'rumo-popconfirm');

    return vnode;
  },

  mounted() {
    let reference = this.referenceElm = this.$refs.reference || this.$el;

    if (reference) {
      reference.setAttribute('aria-describedby', this.tooltipId);
      reference.setAttribute('tabindex', 0);

      if (this.trigger === 'click') {
        on(reference, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick);
      } else if (this.trigger === 'focus') {
        let found = false;
        if ([].slice.call(reference.children).length) {
          const children = reference.childNodes;
          const len = children.length;
          for (let i = 0; i < len; i++) {
            if (children[i].nodeName === 'INPUT' ||
              children[i].nodeName === 'TEXTAREA') {
              on(children[i], 'focusin', this.show);
              on(children[i], 'focusout', this.hide);
              found = true;
              break;
            }
          }
        }
        if (found) return;
        if (reference.nodeName === 'INPUT' ||
          reference.nodeName === 'TEXTAREA') {
          on(reference, 'focusin', this.show);
          on(reference, 'focusout', this.hide);
        } else {
          on(reference, 'mousedown', this.show);
          on(reference, 'mouseup', this.hide);
        }
      } else {
        on(reference, 'focus', () => {
          if (!this.$slots.default || !this.$slots.default.length) {
            this.handleFocus();
            return;
          }
          const instance = this.$slots.default[0].componentInstance;
          if (instance && instance.focus) {
            instance.focus();
          } else {
            this.handleFocus();
          }
        });
        on(reference, 'blur', this.handleBlur);
        on(reference, 'click', this.removeFocusing);
        on(reference, 'mouseenter', this.show);
        on(reference, 'mouseleave', this.hide);
      }
    }
  },
  watch: {
    focusing(val) {
      if (val) {
        addClass(this.referenceElm, 'focusing');
      } else {
        removeClass(this.referenceElm, 'focusing');
      }
    },
    showPopper(val) {
      if (val) {
        this.$emit('show');
      } else {
        this.$emit('hide');
      }
    }
  },
  methods: {
    doToggle() {
      if (this.showPopper) {
        this.hide();
      } else {
        this.show();
      }
    },

    show() {
      this.setExpectedState(true);
      this.handleShowPopper();
    },

    hide() {
      this.setExpectedState(false);
      this.debounceClose();
    },
    handleFocus() {
      this.focusing = true;
      this.show();
    },
    handleBlur() {
      this.focusing = false;
      this.hide();
    },
    removeFocusing() {
      this.focusing = false;
    },

    concatClass(a, b) {
      if (a && a.indexOf(b) > -1) return a;
      return a ? b ? (a + ' ' + b) : a : (b || '');
    },

    handleDocumentClick(e) {
      let reference = this.referenceElm;
      const popper = this.popper || this.$refs.popper;

      if (!this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)) return;
      this.showPopper = false;
    },

    handleShowPopper() {
      if (!this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.showPopper = true;
      }, this.openDelay);

      if (this.hideAfter > 0) {
        this.timeoutPending = setTimeout(() => {
          this.showPopper = false;
        }, this.hideAfter);
      }
    },

    handleClosePopper() {
      if (this.enterable && this.expectedState || this.manual) return;
      clearTimeout(this.timeout);

      if (this.timeoutPending) {
        clearTimeout(this.timeoutPending);
      }
      this.showPopper = false;
      if (this.disabled) {
        this.doDestroy();
      }
    },

    setExpectedState(expectedState) {
      if (expectedState === false) {
        clearTimeout(this.timeoutPending);
      }
      this.expectedState = expectedState;
    },

    handleConfirm() {
      this.onConfirm();
      this.hide();
    },

    handleCancel() {
      this.onCancel();
      this.hide();
    }
  },

  destroyed() {
    const reference = this.referenceElm;
    off(reference, 'mouseenter', this.show);
    off(reference, 'mouseleave', this.hide);
    off(reference, 'focus', this.handleFocus);
    off(reference, 'focusin', this.show);
    off(reference, 'focusout', this.hide);
    off(reference, 'mousedown', this.show);
    off(reference, 'mouseup', this.hide);
    off(reference, 'blur', this.handleBlur);
    off(reference, 'click', this.removeFocusing);
    off(document, 'click', this.handleDocumentClick);
  }
};
