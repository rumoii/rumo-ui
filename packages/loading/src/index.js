import Vue from 'vue';
import loadingVue from './loading.vue';
import { addClass, removeClass, getStyle } from 'rumo-ui/src/utils/dom';
import merge from 'rumo-ui/src/utils/merge';
import { isVNode } from 'rumo-ui/src/utils/vdom';

const LoadingConstructor = Vue.extend(loadingVue);

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  preventScroll: false,
  customClass: ''
};

let fullscreenLoading;

LoadingConstructor.prototype.originalPosition = '';
LoadingConstructor.prototype.originalOverflow = '';

LoadingConstructor.prototype.close = function() {
  if (this.fullscreen) {
    fullscreenLoading = undefined;
  }
  this.$on('after-leave', _ => {
    const target = this.fullscreen || this.body
      ? document.body
      : this.target;
    removeClass(target, 'rumo-loading-parent--relative');
    removeClass(target, 'rumo-loading-parent--hidden');
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$destroy();
  });
  this.visible = false;
};

const addStyle = (options, parent, instance) => {
  let maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position');
    instance.originalOverflow = getStyle(document.body, 'overflow');
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position');
    ['top', 'left'].forEach(property => {
      let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[property] = options.target.getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] +
        'px';
    });
    ['height', 'width'].forEach(property => {
      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
    });
  } else {
    instance.originalPosition = getStyle(parent, 'position');
  }
  Object.keys(maskStyle).forEach(property => {
    instance.$el.style[property] = maskStyle[property];
  });
};

const Loading = (options = {}) => {
  if (Vue.prototype.$isServer) return;
  options = merge({}, defaults, options);
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  options.target = options.target || document.body;
  if (options.target !== document.body) {
    options.fullscreen = false;
  } else {
    options.body = true;
  }
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }

  let parent = options.body ? document.body : options.target;
  let instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  });

  // 添加默认插槽
  if (options.slot !== undefined) {
    let slot = '';
    try {
      slot = instance.$createElement(options.slot, {
        props: {progress: 10}
      });
      instance.computeProps = function(props) {
        Object.keys(props).map(key=>{
          this.$children[0][key] = props[key];
        });
      };
    } catch (error) {
    }
    if (isVNode(slot)) {
      instance.$slots.default = [slot];
    }
  }
  addStyle(options, parent, instance);
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'rumo-loading-parent--relative');
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, 'rumo-loading-parent--hidden');
  }
  if (options.preventScroll) {
    addClass(options.target, 'rumo-loading-prevent-scroll');
  }
  parent.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });
  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  return instance;
};

export default Loading;
