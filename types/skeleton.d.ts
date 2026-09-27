// Derived from element-plus/packages/components/skeleton/src/skeleton.ts (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import { RumoUIComponent } from './component'
export declare class RumoSkeleton extends RumoUIComponent {
  animated: boolean
  count: number
  rows: number
  loading: boolean
  throttle: number | { leading?: number; trailing?: number }
  uiLoading: boolean
}
