import { RumoUIComponent } from './component'

/** Rect-Checkbox Component */
export declare class RumoRectCheckbox extends RumoUIComponent {
  /** The rect-checkbox label */
  label: string

  /** The rect-checkbox value */
  value: string | number

  /** The v-model bind value */
  modelValue: string | string[] | boolean

  /** If the rect-checkbox is disabled */
  disabled: boolean

  /** The width of rect-checkbox */
  width: string | number

  /** The height of rect-checkbox */
  height: string | number
}
