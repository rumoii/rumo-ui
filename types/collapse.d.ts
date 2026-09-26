import { RumoUIComponent } from './component'

/** Use Collapse to store contents. */
export declare class RumoCollapse extends RumoUIComponent {
  /** Whether to activate accordion mode */
  accordion: boolean

  /** Currently active panel */
  value: string | number | string[] | number[]
}
