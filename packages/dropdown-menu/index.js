import RumoDropdownMenu from '../dropdown/src/dropdown-menu';

/* istanbul ignore next */
RumoDropdownMenu.install = function(Vue) {
  Vue.component(RumoDropdownMenu.name, RumoDropdownMenu);
};

export default RumoDropdownMenu;
