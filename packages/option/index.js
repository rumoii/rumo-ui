import RumoOption from '../select/src/option';

/* istanbul ignore next */
RumoOption.install = function(Vue) {
  Vue.component(RumoOption.name, RumoOption);
};

export default RumoOption;
