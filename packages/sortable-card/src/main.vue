<template>
  <div
    class="rumo-sortable-card"
    :class="{ 'is-dragging': dragging, 'is-disabled': disabled }"
    :style="rootStyle"
  >
    <div
      v-if="showHandle"
      class="rumo-sortable-card__handle"
      :class="{ 'is-active': dragging }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-label="ariaLabel"
      :aria-disabled="disabled ? 'true' : 'false'"
      @mousedown="onHandleDown"
      @touchstart="onHandleDown"
    >
      <slot name="handle">
        <svg viewBox="0 0 14 8" width="14" height="8" fill="currentColor" aria-hidden="true">
          <circle cx="2" cy="2" r="1" />
          <circle cx="2" cy="6" r="1" />
          <circle cx="7" cy="2" r="1" />
          <circle cx="7" cy="6" r="1" />
          <circle cx="12" cy="2" r="1" />
          <circle cx="12" cy="6" r="1" />
        </svg>
      </slot>
    </div>

    <div v-if="$slots.header" class="rumo-sortable-card__header">
      <slot name="header"></slot>
    </div>

    <div class="rumo-sortable-card__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/* 拖拽排序壳:仅把手上按住触发,原生 pointer(鼠标/触摸)事件实现,不引拖拽库。
 * 组件只发事件,排序数组由使用方维护;v-for 使用时以 index 传当前序。 */

function eventPoint(e) {
  if (e.touches && e.touches.length) return e.touches[0];
  if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
  return e;
}

export default {
  name: 'RumoSortableCard',

  props: {
    // 当前序号(父级列表中的位置),move 事件以此为 from
    index: {
      type: Number,
      default: 0
    },
    // 禁用拖拽:把手不可用,不发 move
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示拖拽把手;handle 插槽可替换把手内容
    handle: {
      type: Boolean,
      default: true
    }
  },

  data: function() {
    return {
      dragging: false,
      translateX: 0,
      translateY: 0
    };
  },

  computed: {
    showHandle() {
      return this.handle || !!this.$slots.handle;
    },
    rootStyle() {
      if (!this.dragging) return null;
      return {
        transform: 'translate(' + this.translateX + 'px, ' + this.translateY + 'px)'
      };
    },
    ariaLabel() {
      return this.disabled ? 'Drag disabled' : 'Drag to reorder';
    }
  },

  beforeDestroy: function() {
    this.teardown();
  },

  methods: {
    onHandleDown: function(e) {
      if (this.disabled || this.dragging) return;
      if (e.type === 'mousedown' && e.button !== 0) return;

      var point = eventPoint(e);
      if (e.cancelable) e.preventDefault();

      var slots = this.collectSlots();
      var selfIndex = this.findSelfIndex(slots);
      if (selfIndex < 0) return;

      this._drag = {
        startX: point.clientX,
        startY: point.clientY,
        fromIndex: this.index,
        toIndex: this.index,
        slots: slots,
        selfIndex: selfIndex
      };

      this.dragging = true;
      this.translateX = 0;
      this.translateY = 0;
      this.$emit('drag-start');

      document.addEventListener('mousemove', this.onDragMove);
      document.addEventListener('mouseup', this.onDragUp);
      document.addEventListener('touchmove', this.onDragMove, { passive: false });
      document.addEventListener('touchend', this.onDragUp);
      document.addEventListener('touchcancel', this.onDragUp);
    },

    onDragMove: function(e) {
      if (!this._drag) return;
      if (e.cancelable) e.preventDefault();

      var point = eventPoint(e);
      var dx = point.clientX - this._drag.startX;
      var dy = point.clientY - this._drag.startY;
      this.translateX = dx;
      this.translateY = dy;

      /* 槽位序号(同级 DOM)换算回使用方列表序号 */
      var targetSlot = this.resolveTarget(dy);
      this._drag.toIndex = this._drag.fromIndex + (targetSlot - this._drag.selfIndex);
      this.applySiblingShift(this._drag.selfIndex, targetSlot);
    },

    onDragUp: function() {
      if (!this._drag) return;
      var from = this._drag.fromIndex;
      var to = this._drag.toIndex;
      this.teardown();
      this.dragging = false;
      this.translateX = 0;
      this.translateY = 0;
      if (from !== to) {
        this.$emit('move', from, to);
      }
      this.$emit('drag-end');
    },

    teardown: function() {
      document.removeEventListener('mousemove', this.onDragMove);
      document.removeEventListener('mouseup', this.onDragUp);
      document.removeEventListener('touchmove', this.onDragMove);
      document.removeEventListener('touchend', this.onDragUp);
      document.removeEventListener('touchcancel', this.onDragUp);
      if (this._drag) {
        this.applySiblingShift(this._drag.selfIndex, this._drag.selfIndex);
        this._drag = null;
      }
    },

    /* 同一父节点下的 .rumo-sortable-card,按纵向位置排序,含自己 */
    collectSlots: function() {
      var el = this.$el;
      var parent = el && el.parentNode;
      if (!parent) return [];
      var out = [];
      var children = parent.children;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var cls = ' ' + (child.className ? String(child.className) : '') + ' ';
        if (child === el || cls.indexOf(' rumo-sortable-card ') !== -1) {
          out.push({
            el: child,
            self: child === el,
            top: child.offsetTop,
            height: child.offsetHeight
          });
        }
      }
      out.sort(function(a, b) { return a.top - b.top; });
      return out;
    },

    findSelfIndex: function(slots) {
      for (var i = 0; i < slots.length; i++) {
        if (slots[i].self) return i;
      }
      return -1;
    },

    /* 拖动中心距各槽中心最近的槽,作为目标序号 */
    resolveTarget: function(dy) {
      var state = this._drag;
      if (!state || !state.slots.length) return state ? state.fromIndex : 0;

      var self = state.slots[state.selfIndex];
      var center = self.top + self.height / 2 + dy;
      var best = state.selfIndex;
      var bestDist = Infinity;

      for (var i = 0; i < state.slots.length; i++) {
        var slot = state.slots[i];
        var slotCenter = slot.top + slot.height / 2;
        var dist = Math.abs(center - slotCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    },

    /* 途经卡片位移,形成插入位视觉;不改 DOM 顺序。from/to 为槽位序号 */
    applySiblingShift: function(from, to) {
      var state = this._drag;
      if (!state) return;
      var slots = state.slots;
      var self = slots[state.selfIndex];
      var step = self.height;

      for (var i = 0; i < slots.length; i++) {
        if (i === state.selfIndex) continue;
        var offset = 0;
        if (from < to && i > from && i <= to) {
          offset = -step;
        } else if (from > to && i >= to && i < from) {
          offset = step;
        }
        if (slots[i].el) {
          slots[i].el.style.transform = offset ? 'translateY(' + offset + 'px)' : '';
        }
      }
    }
  }
};
</script>
