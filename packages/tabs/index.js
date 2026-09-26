import RumoTabs from './src/tabs';

/* istanbul ignore next */
RumoTabs.install = function(Vue) {
  Vue.component(RumoTabs.name, RumoTabs);
};

export default RumoTabs;
