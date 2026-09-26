import RumoTable from './src/table';

/* istanbul ignore next */
RumoTable.install = function(Vue) {
  Vue.component(RumoTable.name, RumoTable);
};

export default RumoTable;
