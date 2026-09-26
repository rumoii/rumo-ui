import RumoTableColumn from './src/table-column';
import RumoTable from './src/table';

/* istanbul ignore next */
export default function(Vue) {
  Vue.component(RumoTable.name, RumoTable);
  Vue.component(RumoTableColumn.name, RumoTableColumn);
};

export { RumoTable, RumoTableColumn };
