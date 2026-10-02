// RumoTrendZoom lives in packages/trend-chart/src/zoom.vue; this thin package
// gives it its own components.json entry so the aggregate install registers it.
import TrendZoom from '../trend-chart/src/zoom';

TrendZoom.install = function(Vue) { Vue.component(TrendZoom.name, TrendZoom); };
export default TrendZoom;
