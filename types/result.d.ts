import { RumoUIComponent } from '../component'

/** Result Component */
export declare class RumoResult extends RumoUIComponent {
  /** Title of result */
  title: string

  /** Sub title of result */
  subTitle: string

  /** Icon type of result */
  icon: 'primary' | 'success' | 'warning' | 'info' | 'error'
}
