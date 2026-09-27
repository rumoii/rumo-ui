import { RumoUIComponent } from '../component'

/** Text Component */
export declare class RumoText extends RumoUIComponent {
  /** Text type */
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | ''

  /** Text size */
  size: 'large' | 'default' | 'small' | ''

  /** Render ellipsis */
  truncated: boolean

  /** Maximum lines */
  lineClamp: number | string

  /** Custom element tag */
  tag: string
}
