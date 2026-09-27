// Uses qrcode@1.5.4 (MIT) — https://github.com/soldair/node-qrcode
import Qr from './src/main';
Qr.install = function(Vue) { Vue.component(Qr.name, Qr); };
export default Qr;
