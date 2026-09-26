import { VNodeDirective } from 'vue'

export interface RumoInfiniteScroll extends VNodeDirective {
  name: 'infinite-scroll',
  value: Function
}