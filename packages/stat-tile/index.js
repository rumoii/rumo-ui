import StatTile from './src/main';
import StatGrid from './src/grid';

// RumoStatGrid 与 RumoStatTile 同包交付:install 一并注册,components.json 只占 stat-tile 一键
StatTile.install = function(Vue) {
  Vue.component(StatTile.name, StatTile);
  Vue.component(StatGrid.name, StatGrid);
};
export default StatTile;
export { StatGrid };
