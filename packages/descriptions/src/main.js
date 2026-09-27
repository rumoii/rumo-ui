// Derived from element-plus/packages/components/descriptions/src/{description.vue,descriptions-row.vue,descriptions-cell.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import DescriptionsItem from './descriptions-item';

function itemFromVNode(vnode) {
  const option = vnode && vnode.componentOptions;
  if (!option || option.Ctor.options.name !== 'RumoDescriptionsItem') return null;
  const children = option.children || [];
  return {
    props: option.propsData || {},
    content: children.filter(node => !node.data || node.data.slot !== 'label'),
    label: children.filter(node => node.data && node.data.slot === 'label')
  };
}

export default {
  name: 'RumoDescriptions', componentName: 'RumoDescriptions',
  inject: { rumoForm: { default: null } },
  provide() { return { rumoDescriptions: this }; },
  props: {
    border: Boolean, column: { type: Number, default: 3 },
    direction: { type: String, default: 'horizontal' }, size: String,
    title: { type: String, default: '' }, extra: { type: String, default: '' }, labelWidth: [String, Number]
  },
  computed: {
    descriptionsSize() { return this.size || (this.rumoForm && this.rumoForm.size) || (this.$RUMO && this.$RUMO.size); }
  },
  methods: {
    getRows() {
      const columns = Math.max(1, Math.floor(this.column) || 1);
      const rows = []; const used = [];
      (this.$slots.default || []).map(itemFromVNode).filter(Boolean).forEach(item => {
        const span = Math.min(columns, Math.max(1, Math.floor(item.props.span) || 1));
        const rowspan = Math.max(1, Math.floor(item.props.rowspan) || 1);
        let row = 0; let col = -1;
        while (col < 0) {
          if (!used[row]) used[row] = Array(columns).fill(false);
          for (let start = 0; start <= columns - span; start++) {
            if (used[row].slice(start, start + span).every(value => !value)) { col = start; break; }
          }
          if (col < 0) row++;
        }
        for (let r = row; r < row + rowspan; r++) {
          if (!used[r]) used[r] = Array(columns).fill(false);
          for (let c = col; c < col + span; c++) used[r][c] = true;
        }
        if (!rows[row]) rows[row] = [];
        rows[row].push({ item, span, rowspan, col });
      });
      for (let i = 0; i < used.length; i++) if (!rows[i]) rows[i] = [];
      return rows;
    },
    cell(h, entry, type, key) {
      return h(DescriptionsItem, { key, props: {
        cellType: type, cellProps: entry.item.props, labelNodes: entry.item.label,
        contentNodes: entry.item.content, cellSpan: entry.span, cellRowspan: entry.rowspan
      } });
    },
    renderRow(h, row, index) {
      const ordered = row.slice().sort((a, b) => a.col - b.col);
      if (this.direction === 'vertical') {
        return [h('tr', { key: 'label-' + index }, ordered.map((entry, i) => this.cell(h, entry, 'label-vertical', index + '-l-' + i))),
          h('tr', { key: 'content-' + index }, ordered.map((entry, i) => this.cell(h, entry, 'content-vertical', index + '-c-' + i)))];
      }
      const cells = [];
      ordered.forEach((entry, i) => {
        if (this.border) cells.push(this.cell(h, entry, 'label', index + '-l-' + i));
        cells.push(this.cell(h, entry, this.border ? 'content' : 'both', index + '-c-' + i));
      });
      return [h('tr', { key: 'row-' + index }, cells)];
    }
  },
  render(h) {
    const header = this.title || this.extra || this.$slots.title || this.$slots.extra
      ? h('div', { class: 'rumo-descriptions__header' }, [
        h('div', { class: 'rumo-descriptions__title' }, this.$slots.title || this.title),
        h('div', { class: 'rumo-descriptions__extra' }, this.$slots.extra || this.extra)
      ]) : null;
    const body = h('div', { class: 'rumo-descriptions__body' }, [
      h('table', { class: ['rumo-descriptions__table', { 'is-bordered': this.border }] }, [
        h('tbody', this.getRows().reduce((all, row, index) => all.concat(this.renderRow(h, row, index)), []))
      ])
    ]);
    return h('div', { class: ['rumo-descriptions', this.descriptionsSize && 'rumo-descriptions--' + this.descriptionsSize] }, [header, body]);
  }
};
