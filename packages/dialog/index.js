import RumoDialog from './src/component';

/* istanbul ignore next */
RumoDialog.install = function(Vue) {
  Vue.component(RumoDialog.name, RumoDialog);
};

export default RumoDialog;
