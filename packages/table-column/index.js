import RumoTableColumn from '../table/src/table-column';

/* istanbul ignore next */
RumoTableColumn.install = function(Vue) {
  Vue.component(RumoTableColumn.name, RumoTableColumn);
};

export default RumoTableColumn;
