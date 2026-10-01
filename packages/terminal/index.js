import Terminal from './src/main';

/* istanbul ignore next */
Terminal.install = function(Vue) {
  Vue.component(Terminal.name, Terminal);
};

export default Terminal;
