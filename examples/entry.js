import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
import RUMO from 'main/index.js';
import hljs from 'highlight.js';
import routes from './route.config';
import DemoBlock from './components/demo-block.vue';
import MainFooter from './components/footer.vue';
import MainHeader from './components/header.vue';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';
import title from './i18n/title.json';

import 'rumo-ui/packages/theme-chalk/src/index.scss';
import './demo-styles/index.scss';
import './assets/styles/common.css';
import './assets/styles/fonts/style.css';
import 'highlight.js/styles/color-brewer.css';

Vue.use(RUMO, {
  size: 'small',
  getPopupContainer: function() { return document.getElementById('app');},
  namespaceClass: 'namespace-class',
  messageOffsetTop: 40,
  drawer: {
    flexLayout: false
  }
});
Vue.use(VueRouter);
Vue.component('demo-block', DemoBlock);
Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
Vue.component('footer-nav', FooterNav);

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });

  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Rumo UI';
});

new Vue({ // eslint-disable-line
  ...entry,
  router
}).$mount('#app');
