import RumoCarousel from './src/main';
import RumoCarouselItem from './src/item';

/* istanbul ignore next */
export default function(Vue) {
  Vue.component(RumoCarousel.name, RumoCarousel);
  Vue.component(RumoCarouselItem.name, RumoCarouselItem);
};

export { RumoCarousel, RumoCarouselItem };
