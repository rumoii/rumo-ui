// Derived from element-plus/packages/components/segmented/src/segmented.ts (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import { RumoUIComponent } from './component'
export type SegmentedOption = string | number | boolean | Record<string, any>
export type SegmentedVariant = 'dash'
export declare class RumoSegmented extends RumoUIComponent {
  value: string | number | boolean
  options: SegmentedOption[]
  props: { label?: string; value?: string; disabled?: string }
  direction: 'horizontal' | 'vertical'
  block: boolean
  size: string
  disabled: boolean
  validateEvent: boolean
  name: string
  ariaLabel: string
  /** Dash skin visual variant; when set, overrides the default look */
  variant: SegmentedVariant
}
