// RumoStatGrid lives in packages/stat-tile/src/grid.vue; this thin package
// gives it its own components.json entry so the aggregate install registers it.
import StatGrid from '../stat-tile/src/grid';

StatGrid.install = function(Vue) { Vue.component(StatGrid.name, StatGrid); };
export default StatGrid;
