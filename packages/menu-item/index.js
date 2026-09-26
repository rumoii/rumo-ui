import RumoMenuItem from '../menu/src/menu-item';

/* istanbul ignore next */
RumoMenuItem.install = function(Vue) {
  Vue.component(RumoMenuItem.name, RumoMenuItem);
};

export default RumoMenuItem;
