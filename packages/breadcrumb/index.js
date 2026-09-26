import RumoBreadcrumb from './src/breadcrumb';

/* istanbul ignore next */
RumoBreadcrumb.install = function(Vue) {
  Vue.component(RumoBreadcrumb.name, RumoBreadcrumb);
};

export default RumoBreadcrumb;
