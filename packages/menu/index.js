import RumoMenu from './src/menu';

/* istanbul ignore next */
RumoMenu.install = function(Vue) {
  Vue.component(RumoMenu.name, RumoMenu);
};

export default RumoMenu;
