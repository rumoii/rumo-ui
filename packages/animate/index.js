// Uses animejs@3.2.2 (MIT) — https://github.com/juliangarnier/anime
import Animate from './src/main';
import AnimateDirective from './src/directive';

Animate.install = function(Vue) {
  Vue.component(Animate.name, Animate);
  Vue.directive(AnimateDirective.name, AnimateDirective);
};

export { AnimateDirective };
export default Animate;
