import { debounce } from 'throttle-debounce';

/**
 * 滚动加载指令工厂。
 *
 * 用法：
 *   directives: { WaterfallLower: Waterfall('lower'), WaterfallUpper: Waterfall('upper') }
 *   <div v-waterfall-lower="loadMore" :waterfall-offset="50">...</div>
 *
 * 属性：
 *   waterfall-offset  触发阈值（px），默认 300
 *   waterfall-target  滚动容器选择器，缺省自动上溯 overflow-y: scroll|auto 的祖先，兜底 window
 *
 * 触发条件（direction 为 'lower' | 'upper'）：
 *   lower: scrollHeight - (scrollTop + visibleHeight) < offset
 *   upper: scrollTop < offset
 * 回调参数：{ target, top }
 */
const DEFAULT_OFFSET = 300;

const stateMap = new WeakMap();

function getScrollContainer(el, selector) {
  if (selector) {
    return document.querySelector(selector) || window;
  }
  let node = el;
  while (node && node !== document.body) {
    const overflowY = window.getComputedStyle(node).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return node;
    }
    node = node.parentElement;
  }
  return window;
}

function getScrollTop(container) {
  return container === window
    ? (window.pageYOffset || document.documentElement.scrollTop || 0)
    : container.scrollTop;
}

function getVisibleHeight(container) {
  return container === window
    ? (window.innerHeight || document.documentElement.clientHeight || 0)
    : container.clientHeight;
}

function getScrollHeight(container) {
  return container === window
    ? (document.documentElement.scrollHeight || document.body.scrollHeight || 0)
    : container.scrollHeight;
}

function readState(el, vnode) {
  const state = stateMap.get(el);
  if (!state) return null;
  const attrs = (vnode && vnode.data && vnode.data.attrs) || {};
  const offsetAttr = attrs['waterfall-offset'];
  if (offsetAttr !== undefined && offsetAttr !== null && offsetAttr !== '') {
    const parsed = Number(offsetAttr);
    if (!isNaN(parsed)) {
      state.offset = parsed;
    }
  }
  return state;
}

export default function Waterfall(direction) {
  function check(el) {
    const state = stateMap.get(el);
    if (!state || typeof state.callback !== 'function') return;
    const { container, offset, callback } = state;
    const top = getScrollTop(container);
    const visible = getVisibleHeight(container);
    const scrollHeight = getScrollHeight(container);
    let hit = false;
    if (direction === 'lower') {
      hit = scrollHeight - (top + visible) < offset;
    } else if (direction === 'upper') {
      hit = top < offset;
    }
    if (hit) {
      callback({ target: container, top });
    }
  }

  return {
    bind(el, binding, vnode) {
      const attrs = (vnode.data && vnode.data.attrs) || {};
      const selector = attrs['waterfall-target'] || undefined;
      const container = getScrollContainer(el, selector);
      const state = {
        callback: binding.value,
        container,
        offset: DEFAULT_OFFSET
      };
      stateMap.set(el, state);
      readState(el, vnode);
      state.handler = debounce(200, () => check(el));
      container.addEventListener('scroll', state.handler, { capture: true, passive: true });
    },
    update(el, binding, vnode) {
      const state = readState(el, vnode);
      if (!state) return;
      state.callback = binding.value;
      state.handler();
    },
    unbind(el) {
      const state = stateMap.get(el);
      if (!state) return;
      state.container.removeEventListener('scroll', state.handler, { capture: true });
      stateMap.delete(el);
    }
  };
}
