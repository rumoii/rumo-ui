import RumoSubmenu from '../menu/src/submenu';

/* istanbul ignore next */
RumoSubmenu.install = function(Vue) {
  Vue.component(RumoSubmenu.name, RumoSubmenu);
};

export default RumoSubmenu;
