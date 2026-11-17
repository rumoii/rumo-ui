import { RumoUIComponent } from './component'

export type DrawerDirection = 'ltr' | 'rtl' | 'ttb' | 'btt'

/** Drawer Component */
export declare class RumoDrawer extends RumoUIComponent {
  appendToBody: boolean
  beforeClose: (done: (cancel?: boolean) => void) => void
  customClass: string
  closeOnPressEscape: boolean
  destroyOnClose: boolean
  modal: boolean
  direction: DrawerDirection
  modalAppendToBody: boolean
  showClose: boolean
  size: string
  title: string
  visible: boolean
  wrapperClosable: boolean
  withHeader: boolean
  flexLayout: boolean | null

  /** Props inherited from the popup mixin; untyped props accept any value */
  openDelay: any
  closeDelay: any
  zIndex: any
  modalFade: boolean
  modalClass: any
  lockScroll: boolean
  closeOnClickModal: boolean

  closeDrawer(): void
}
