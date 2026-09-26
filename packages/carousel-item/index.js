import RumoCarouselItem from '../carousel/src/item';

/* istanbul ignore next */
RumoCarouselItem.install = function(Vue) {
  Vue.component(RumoCarouselItem.name, RumoCarouselItem);
};

export default RumoCarouselItem;
