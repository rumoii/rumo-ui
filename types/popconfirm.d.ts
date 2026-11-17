import { RumoUIComponent, RumoUIComponentSize } from './component'
import { PopoverPlacement, PopoverTrigger } from './popover'

/** Popconfirm Component */
export declare class RumoPopconfirm extends RumoUIComponent {
  disabled: boolean
  manual: boolean
  effect: string
  arrowOffset: number
  popperClass: string
  content: string
  visibleArrow: any
  transition: string
  popperOptions: any
  enterable: boolean
  hideAfter: number
  placement: PopoverPlacement
  trigger: PopoverTrigger
  title: string
  message: string
  width: number
  size: RumoUIComponentSize
  icon: string
  buttonStyle: any
  buttonText: string
  onConfirm: () => void
  onCancel: () => void
  confirmText: string
  cancelText: string

  /** Props inherited from the popper mixin; untyped props accept any value */
  transformOrigin: boolean | string
  boundariesPadding: number
  reference: any
  popper: any
  offset: any
  value: boolean
  appendToBody: boolean
}
