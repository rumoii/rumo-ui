import LogViewer from './src/main';

/* istanbul ignore next */
LogViewer.install = function(Vue) {
  Vue.component(LogViewer.name, LogViewer);
};

export default LogViewer;

