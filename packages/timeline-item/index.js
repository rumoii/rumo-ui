import RumoTimelineItem from '../timeline/src/item';

/* istanbul ignore next */
RumoTimelineItem.install = function(Vue) {
  Vue.component(RumoTimelineItem.name, RumoTimelineItem);
};

export default RumoTimelineItem;
