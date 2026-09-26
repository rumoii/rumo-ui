import { RumoUIComponent, RumoUIComponentSize } from './component'

export type ColorFormat = 'hsl' | 'hsv' | 'hex' | 'rgb'

/** ColorPicker Component */
export declare class RumoColorPicker extends RumoUIComponent {
  /** Whether to display the alpha slider */
  showAlpha: boolean

  /** Whether to disable the ColorPicker */
  disabled: boolean

  /** Size of ColorPicker */
  size: RumoUIComponentSize

  /** Whether to display the alpha slider */
  popperClass: string

  /** Custom class name for ColorPicker's dropdown */
  colorFormat: ColorFormat
}
