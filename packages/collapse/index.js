import RumoCollapse from './src/collapse';

/* istanbul ignore next */
RumoCollapse.install = function(Vue) {
  Vue.component(RumoCollapse.name, RumoCollapse);
};

export default RumoCollapse;

