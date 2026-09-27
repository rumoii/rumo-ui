// Derived from element-plus/packages/components/descriptions/src/{description-item.ts,descriptions-cell.ts} (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
function unit(value) { return typeof value === 'number' ? value + 'px' : value; }
export default {
  name: 'RumoDescriptionsItem', componentName: 'RumoDescriptionsItem',
  inject: { rumoDescriptions: { default: null } },
  props: {
    label: { type: String, default: '' }, span: { type: Number, default: 1 }, rowspan: { type: Number, default: 1 },
    width: [String, Number], minWidth: [String, Number], labelWidth: [String, Number],
    align: { type: String, default: 'left' }, labelAlign: String, className: String, labelClassName: String,
    cellType: String, cellProps: Object, labelNodes: Array, contentNodes: Array, cellSpan: Number, cellRowspan: Number
  },
  render(h) {
    const parent = this.rumoDescriptions;
    if (!parent || !this.cellType) return h('span', this.$slots.default || []);
    const item = this.cellProps || {};
    const label = this.labelNodes && this.labelNodes.length ? this.labelNodes : item.label;
    const content = this.contentNodes || [];
    const labelCell = this.cellType.indexOf('label') === 0;
    const vertical = this.cellType.indexOf('vertical') > -1;
    const both = this.cellType === 'both';
    const labelWidth = item.labelWidth !== undefined ? item.labelWidth : parent.labelWidth;
    const width = labelCell && labelWidth !== undefined ? labelWidth : item.width;
    const style = { width: unit(width), minWidth: unit(item.minWidth) };
    const classes = ['rumo-descriptions__cell', 'is-' + (labelCell ? item.labelAlign || item.align || 'left' : item.align || 'left')];
    let children = content;
    if (labelCell) {
      classes.push('rumo-descriptions__label', item.labelClassName, parent.border && 'is-bordered-label', vertical && 'is-vertical-label');
      children = label;
    } else if (both) {
      const labelStyle = labelWidth === undefined ? {} : { width: unit(labelWidth), display: 'inline-block' };
      children = [h('span', { class: ['rumo-descriptions__label', item.labelClassName], style: labelStyle }, label),
        h('span', { class: ['rumo-descriptions__content', item.className] }, content)];
    } else classes.push('rumo-descriptions__content', item.className, parent.border && 'is-bordered-content', vertical && 'is-vertical-content');
    return h(vertical && labelCell ? 'th' : 'td', {
      class: classes, style,
      attrs: { colspan: both || vertical ? this.cellSpan : labelCell ? 1 : this.cellSpan * 2 - 1,
        rowspan: vertical ? labelCell ? 1 : this.cellRowspan * 2 - 1 : this.cellRowspan }
    }, children);
  }
};
