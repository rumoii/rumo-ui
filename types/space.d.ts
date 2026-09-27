import { RumoUIComponent } from '../component'

/** Space Component */
export declare class RumoSpace extends RumoUIComponent {
  /** Placement direction */
  direction: 'horizontal' | 'vertical'

  /** Alignment of items */
  alignment: string

  /** Prefix for space items */
  prefixCls: string

  /** Spacer between items */
  spacer: string | number

  /** Auto wrapping */
  wrap: boolean

  /** Whether to fill the container */
  fill: boolean

  /** Ratio of fill */
  fillRatio: number

  /** Spacing size */
  size: 'small' | 'default' | 'large' | number | [number, number]
}
