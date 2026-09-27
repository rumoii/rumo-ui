<script>
// Derived from splitpanes@v2.4.1/src/components/splitpanes/splitpanes.vue (MIT) — https://github.com/antoniandre/splitpanes @c668ab3b2517e59201e613c198381443bf43c2b6
export default {
  name: 'RumoSplitpanes',
  componentName: 'RumoSplitpanes',
  props: {
    horizontal: Boolean,
    pushOtherPanes: { type: Boolean, default: true },
    dblClickSplitter: { type: Boolean, default: true },
    rtl: Boolean,
    firstSplitter: Boolean
  },
  provide() { return { rumoSplitpanes: this }; },
  data() { return { panes: [], dragging: false, activeSplitter: -1 }; },
  watch: { horizontal() { this.updateStyles(); } },
  mounted() { this.resetSizes(); this.$emit('ready'); },
  beforeDestroy() {
    this.disposed = true;
    this.unbindDrag();
    if (this.dragResetTimer) clearTimeout(this.dragResetTimer);
  },
  methods: {
    number(value, fallback) {
      const parsed = parseFloat(value);
      return isFinite(parsed) ? parsed : fallback;
    },
    limits(pane) {
      const min = Math.max(0, Math.min(100, this.number(pane.vm.min, 0)));
      return { min, max: Math.max(min, Math.min(100, this.number(pane.vm.max, 100))) };
    },
    snapshot() {
      return this.panes.map(pane => Object.assign({}, this.limits(pane), { size: pane.size }));
    },
    sortPanes() {
      this.panes.sort((a, b) => (a.vm.$el.compareDocumentPosition(b.vm.$el) & 4) ? -1 : 1);
    },
    onPaneAdd(vm) {
      this.panes.push({ vm, size: null });
      this.$nextTick(() => {
        if (this.disposed) return;
        this.sortPanes();
        this.resetSizes();
        if (this._isMounted) this.$emit('pane-add', { index: this.panes.findIndex(pane => pane.vm === vm), panes: this.snapshot() });
      });
    },
    onPaneRemove(vm) {
      const index = this.panes.findIndex(pane => pane.vm === vm);
      if (index < 0) return;
      if (this.activeSplitter >= 0) this.endDrag();
      const removed = this.snapshot()[index];
      this.panes.splice(index, 1);
      this.$nextTick(() => {
        if (this.disposed) return;
        this.resetSizes();
        this.$emit('pane-remove', { index, removed, panes: this.snapshot() });
      });
    },
    onPaneChange(vm, changedSize) {
      const pane = this.panes.find(item => item.vm === vm);
      if (!pane) return;
      if (changedSize) {
        if (vm.size === null) { this.resetSizes(); return; }
        const limits = this.limits(pane);
        const desired = Math.max(limits.min, Math.min(limits.max, this.number(vm.size, pane.size)));
        const direction = desired >= pane.size ? 1 : -1;
        const neighbors = this.panes.filter(item => item !== pane);
        const capacity = neighbors.reduce((sum, item) => {
          const bounds = this.limits(item);
          return sum + (direction > 0 ? item.size - bounds.min : bounds.max - item.size);
        }, 0);
        let remaining = Math.min(Math.abs(desired - pane.size), capacity);
        pane.size += direction * remaining;
        neighbors.forEach(item => {
          const bounds = this.limits(item);
          const change = Math.min(remaining, direction > 0 ? item.size - bounds.min : bounds.max - item.size);
          item.size -= direction * change;
          remaining -= change;
        });
      } else this.normalizeSizes();
      this.updateStyles();
      this.$emit('resized', this.snapshot());
    },
    resetSizes() {
      if (!this.panes.length) return;
      let specified = 0;
      let unspecified = 0;
      this.panes.forEach(pane => {
        pane.size = pane.vm.size === null ? null : this.number(pane.vm.size, null);
        if (pane.size === null) unspecified++;
        else specified += pane.size;
      });
      const share = unspecified ? (100 - specified) / unspecified : 0;
      this.panes.forEach(pane => { if (pane.size === null) pane.size = share; });
      this.normalizeSizes();
      this.updateStyles();
      if (this._isMounted) this.$emit('resized', this.snapshot());
    },
    normalizeSizes() {
      this.panes.forEach(pane => {
        const limits = this.limits(pane);
        pane.size = Math.max(limits.min, Math.min(limits.max, this.number(pane.size, 0)));
      });
      for (let pass = 0; pass < this.panes.length + 1; pass++) {
        const remaining = 100 - this.panes.reduce((sum, pane) => sum + pane.size, 0);
        if (Math.abs(remaining) < 0.001) break;
        const candidates = this.panes.filter(pane => {
          const limits = this.limits(pane);
          return remaining > 0 ? pane.size < limits.max - 0.001 : pane.size > limits.min + 0.001;
        });
        if (!candidates.length) break;
        const share = remaining / candidates.length;
        candidates.forEach(pane => {
          const limits = this.limits(pane);
          pane.size = Math.max(limits.min, Math.min(limits.max, pane.size + share));
        });
      }
    },
    updateStyles() {
      this.panes.forEach(pane => {
        pane.vm.paneStyle = this.horizontal ? { height: pane.size + '%' } : { width: pane.size + '%' };
      });
    },
    transfer(index, amount) {
      if (!amount || index < 0 || index >= this.panes.length - 1) return false;
      const grow = amount > 0 ? [index] : [index + 1];
      const shrink = amount > 0 ? [index + 1] : [index];
      if (this.pushOtherPanes) {
        if (amount > 0) {
          for (let i = index - 1; i >= 0; i--) grow.push(i);
          for (let i = index + 2; i < this.panes.length; i++) shrink.push(i);
        } else {
          for (let i = index + 2; i < this.panes.length; i++) grow.push(i);
          for (let i = index - 1; i >= 0; i--) shrink.push(i);
        }
      }
      const growCapacity = grow.reduce((sum, i) => sum + this.limits(this.panes[i]).max - this.panes[i].size, 0);
      const shrinkCapacity = shrink.reduce((sum, i) => sum + this.panes[i].size - this.limits(this.panes[i]).min, 0);
      const change = Math.min(Math.abs(amount), growCapacity, shrinkCapacity);
      if (change < 0.001) return false;
      let remaining = change;
      grow.forEach(i => {
        const pane = this.panes[i];
        const portion = Math.min(remaining, this.limits(pane).max - pane.size);
        pane.size += portion;
        remaining -= portion;
      });
      remaining = change;
      shrink.forEach(i => {
        const pane = this.panes[i];
        const portion = Math.min(remaining, pane.size - this.limits(pane).min);
        pane.size -= portion;
        remaining -= portion;
      });
      this.updateStyles();
      return true;
    },
    coordinate(event) {
      const point = event.touches ? event.touches[0] : event;
      const rect = this.$el.getBoundingClientRect();
      const length = this.horizontal ? rect.height : rect.width;
      const offset = this.horizontal ? point.clientY - rect.top : point.clientX - rect.left;
      return length ? 100 * (this.rtl && !this.horizontal ? length - offset : offset) / length : 0;
    },
    moveTo(event) {
      if (this.activeSplitter < 0 || !this.panes[this.activeSplitter]) return;
      if (event.cancelable) event.preventDefault();
      const prefix = this.panes.slice(0, this.activeSplitter + 1).reduce((sum, pane) => sum + pane.size, 0);
      if (this.transfer(this.activeSplitter, this.coordinate(event) - prefix)) {
        this.dragging = true;
        this.$emit('resize', this.snapshot());
      }
    },
    bindDrag(mode) {
      this.dragMode = mode;
      const doc = this.$el.ownerDocument;
      if (mode === 'pointer') {
        doc.addEventListener('pointermove', this.moveTo);
        doc.addEventListener('pointerup', this.endDrag);
        doc.addEventListener('pointercancel', this.endDrag);
      } else {
        doc.addEventListener(mode === 'touch' ? 'touchmove' : 'mousemove', this.moveTo, { passive: false });
        doc.addEventListener(mode === 'touch' ? 'touchend' : 'mouseup', this.endDrag);
        if (mode === 'touch') doc.addEventListener('touchcancel', this.endDrag);
      }
    },
    unbindDrag() {
      if (!this.dragMode || !this.$el) return;
      const doc = this.$el.ownerDocument;
      if (this.dragMode === 'pointer') {
        doc.removeEventListener('pointermove', this.moveTo);
        doc.removeEventListener('pointerup', this.endDrag);
        doc.removeEventListener('pointercancel', this.endDrag);
      } else {
        doc.removeEventListener(this.dragMode === 'touch' ? 'touchmove' : 'mousemove', this.moveTo);
        doc.removeEventListener(this.dragMode === 'touch' ? 'touchend' : 'mouseup', this.endDrag);
        if (this.dragMode === 'touch') doc.removeEventListener('touchcancel', this.endDrag);
      }
      this.dragMode = null;
    },
    startDrag(event, index, mode) {
      if (event.button !== undefined && event.button !== 0) return;
      if (this.dragResetTimer) clearTimeout(this.dragResetTimer);
      this.unbindDrag();
      this.activeSplitter = index;
      this.dragging = false;
      this.bindDrag(mode);
      if (event.cancelable) event.preventDefault();
    },
    endDrag() {
      if (this.dragging) this.$emit('resized', this.snapshot());
      this.unbindDrag();
      this.activeSplitter = -1;
      this.dragResetTimer = setTimeout(() => {
        this.dragging = false;
        this.dragResetTimer = null;
      }, 100);
    },
    onKeydown(event, index) {
      const pane = this.panes[index];
      if (!pane) return;
      const step = event.shiftKey ? 10 : 1;
      let amount;
      if (event.key === 'Home') amount = this.limits(pane).min - pane.size;
      else if (event.key === 'End') amount = this.limits(pane).max - pane.size;
      else if (this.horizontal && event.key === 'ArrowUp') amount = -step;
      else if (this.horizontal && event.key === 'ArrowDown') amount = step;
      else if (!this.horizontal && event.key === 'ArrowLeft') amount = this.rtl ? step : -step;
      else if (!this.horizontal && event.key === 'ArrowRight') amount = this.rtl ? -step : step;
      else return;
      event.preventDefault();
      if (this.transfer(index, amount)) {
        this.$emit('resize', this.snapshot());
        this.$emit('resized', this.snapshot());
      }
    },
    maximize(index) {
      if (!this.dblClickSplitter || !this.panes[index + 1]) return;
      const target = this.panes[index + 1];
      const othersMin = this.panes.reduce((sum, pane) => sum + (pane === target ? 0 : this.limits(pane).min), 0);
      target.size = Math.min(this.limits(target).max, 100 - othersMin);
      this.panes.forEach(pane => { if (pane !== target) pane.size = this.limits(pane).min; });
      this.normalizeSizes();
      this.updateStyles();
      this.$emit('pane-maximize', Object.assign({}, this.limits(target), { size: target.size }));
      this.$emit('resized', this.snapshot());
    },
    renderSplitter(h, index, decorative) {
      const pane = this.panes[index];
      const limits = pane ? this.limits(pane) : { min: 0, max: 100 };
      return h('div', {
        key: 'splitter-' + index,
        class: 'rumo-splitpanes__splitter',
        attrs: decorative ? { 'aria-hidden': 'true' } : {
          role: 'separator', tabindex: '0',
          'aria-orientation': this.horizontal ? 'horizontal' : 'vertical',
          'aria-valuemin': limits.min, 'aria-valuemax': limits.max,
          'aria-valuenow': pane ? Math.round(pane.size || 0) : 0
        },
        on: decorative ? {} : {
          pointerdown: event => { if (window.PointerEvent) this.startDrag(event, index, 'pointer'); },
          mousedown: event => { if (!window.PointerEvent) this.startDrag(event, index, 'mouse'); },
          touchstart: event => { if (!window.PointerEvent) this.startDrag(event, index, 'touch'); },
          keydown: event => this.onKeydown(event, index),
          dblclick: () => this.maximize(index),
          click: () => { if (!this.dragging) this.$emit('splitter-click', this.snapshot()[index + 1]); }
        }
      });
    }
  },
  render(h) {
    const children = [];
    const panes = (this.$slots.default || []).filter(node => node.tag);
    panes.forEach((node, index) => {
      if (index || this.firstSplitter) children.push(this.renderSplitter(h, index - 1, index === 0));
      children.push(node);
    });
    return h('div', {
      class: ['rumo-splitpanes', this.horizontal ? 'rumo-splitpanes--horizontal' : 'rumo-splitpanes--vertical',
        { 'is-dragging': this.dragging, 'is-rtl': this.rtl }]
    }, children);
  }
};
</script>
