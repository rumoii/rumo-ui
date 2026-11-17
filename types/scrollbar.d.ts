import { RumoUIComponent } from './component'

/** Scrollbar Component */
export declare class RumoScrollbar extends RumoUIComponent {
  native: boolean

  /** Class and style props have no runtime type restriction */
  wrapStyle: any
  wrapClass: any
  viewClass: any
  viewStyle: any

  noresize: boolean
  tag: string

  update(): void
}
