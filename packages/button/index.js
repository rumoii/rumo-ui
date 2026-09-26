import RumoButton from './src/button';

/* istanbul ignore next */
RumoButton.install = function(Vue) {
  Vue.component(RumoButton.name, RumoButton);
};

export default RumoButton;
