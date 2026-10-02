import { RumoUIComponent, RumoUIComponentSize } from './component'

/** Button type */
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'

/** Dash skin visual variant */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

/** Same as native button's type */
export type ButtonNativeType = 'button' | 'submit' | 'reset' | 'menu'

/** Button Component */
export declare class RumoButton extends RumoUIComponent {
  /** Button size */
  size: RumoUIComponentSize

  /** Button type */
  type: ButtonType

  /** Dash skin visual variant; when set, overrides the type-based appearance */
  variant: ButtonVariant

  /** Determine whether it's a plain button */
  plain: boolean

  /** Determine whether it's a round button */
  round: boolean

  /** Determine whether it's loading */
  loading: boolean

  /** Disable the button */
  disabled: boolean

  /** Button icon, accepts an icon name of the icon component */
  icon: string

  /** Same as native button's autofocus */
  autofocus: boolean

  /** Same as native button's type */
  nativeType: ButtonNativeType
}
