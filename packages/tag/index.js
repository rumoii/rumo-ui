import RumoTag from './src/tag';

/* istanbul ignore next */
RumoTag.install = function(Vue) {
  Vue.component(RumoTag.name, RumoTag);
};

export default RumoTag;
