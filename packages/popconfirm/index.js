import PopConfirm from './src/main';
import directive from './src/directive';
import Vue from 'vue';

Vue.directive('popconfirm', directive);

/* istanbul ignore next */
PopConfirm.install = function(Vue) {
  Vue.directive('popconfirm', directive);
  Vue.component(PopConfirm.name, PopConfirm);
};
PopConfirm.directive = directive;

export default PopConfirm;
