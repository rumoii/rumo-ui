// Uses countup.js@2.10.1 (MIT) — https://github.com/inorganik/countUp.js
import Countup from './src/main';

Countup.install = function(Vue) { Vue.component(Countup.name, Countup); };
export default Countup;
