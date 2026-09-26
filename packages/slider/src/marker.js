export default {
  name: 'RumoMarker',

  props: {
    mark: {
      type: [String, Object]
    },
    active: {
      type: Array,
      default: []
    }
  },
  render() {
    let label = typeof this.mark === 'string' ? this.mark : this.mark.label;
    const active = label === JSON.stringify(this.active[0]) || label === JSON.stringify(this.active[1]);
    return (
      <div class={ [ 'rumo-slider__marks-text', active ? 'active' : '' ] } style={ this.mark.style || {} }>
        { label }
      </div>
    );
  }
};
