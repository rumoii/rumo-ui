import RumoOptionGroup from '../select/src/option-group';

/* istanbul ignore next */
RumoOptionGroup.install = function(Vue) {
  Vue.component(RumoOptionGroup.name, RumoOptionGroup);
};

export default RumoOptionGroup;
