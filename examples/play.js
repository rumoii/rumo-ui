import Vue from 'vue';
import App from './play/index.vue';
import RUMO from 'main.index.js';
import 'packages/theme-chalk/src/index.scss';


Vue.use(RUMO)
new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
