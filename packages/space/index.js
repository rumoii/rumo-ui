import Space from './src/main';

/* istanbul ignore next */
Space.install = function(Vue) {
  Vue.component(Space.name, Space);
};

export default Space;
