import Result from './src/main';

/* istanbul ignore next */
Result.install = function(Vue) {
  Vue.component(Result.name, Result);
};

export default Result;
