import RumoProgress from './src/progress';

/* istanbul ignore next */
RumoProgress.install = function(Vue) {
  Vue.component(RumoProgress.name, RumoProgress);
};

export default RumoProgress;
