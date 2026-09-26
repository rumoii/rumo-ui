import RumoAutocomplete from './src/autocomplete';

/* istanbul ignore next */
RumoAutocomplete.install = function(Vue) {
  Vue.component(RumoAutocomplete.name, RumoAutocomplete);
};

export default RumoAutocomplete;
