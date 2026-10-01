import CommandPalette from './src/main';

/* istanbul ignore next */
CommandPalette.install = function(Vue) {
  Vue.component(CommandPalette.name, CommandPalette);
};

export default CommandPalette;
