// Uses animejs@3.2.2 (MIT) — https://github.com/juliangarnier/anime
import { VNodeDirective } from 'vue'
import { RumoUIComponent } from './component'

export type RumoAnimateEffect = 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'zoom-in' | 'pulse' | 'shake' | 'flash' | 'fade-out' | 'fade-out-up' | 'fade-out-down' | 'fade-out-left' | 'fade-out-right'
export interface RumoAnimateOptions {
  effect: RumoAnimateEffect
  duration?: number
  delay?: number
  loop?: boolean | number
}
export declare class RumoAnimate extends RumoUIComponent {
  type: RumoAnimateEffect
  effect: RumoAnimateEffect | ''
  duration: number
  delay: number
  autoplay: boolean
  play(): void
}
export interface RumoAnimateDirective extends VNodeDirective {
  name: 'animate'
  value: RumoAnimateEffect | RumoAnimateOptions
}
export declare const AnimateDirective: RumoAnimateDirective
