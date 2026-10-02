import TrendChart from './src/main';
import TrendZoom from './src/zoom';

TrendChart.install = function(Vue) { Vue.component(TrendChart.name, TrendChart); };
TrendZoom.install = function(Vue) { Vue.component(TrendZoom.name, TrendZoom); };

export default TrendChart;
export { TrendChart, TrendZoom };
