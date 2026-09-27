import { RumoUIComponent } from '../component'

/** SvgIcon Component */
export declare class RumoSvgIcon extends RumoUIComponent {
  /** Icon name (Tabler name, e.g. arrow-left) */
  name: string

  /** Icon size (number in px or any CSS length) */
  size: string | number

  /** Stroke color */
  color: string

  /** Accessible title; when set the icon is exposed to screen readers */
  title: string
}
