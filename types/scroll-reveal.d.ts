// Derived from AOS(精简重写) (MIT) — https://github.com/michalsnik/aos @329fb34f777034345f4d3f4def4dc3bcc300cc2e
import { VNodeDirective } from 'vue'

export type RumoScrollRevealEffect = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'
export interface RumoScrollRevealOptions {
  effect: RumoScrollRevealEffect
  once?: boolean
  delay?: number
  offset?: number
}
export interface RumoScrollReveal extends VNodeDirective {
  name: 'scroll-reveal'
  value: RumoScrollRevealEffect | RumoScrollRevealOptions
}
