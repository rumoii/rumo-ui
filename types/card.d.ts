import { VNode, VNodeDirective } from 'vue'
import { RumoUIComponent } from './component'

export interface CardSlots {
  /** Content of the card */
  default: VNode[],

  /** Title of the card */
  header: VNode[]

  [key: string]: VNode[]
}

/** Integrate information in a card container */
export declare class RumoCard extends RumoUIComponent {
  /** Title of the card */
  header: string

  /** CSS style of body */
  bodyStyle: object

  /** When to show card shadows */
  shadow: string

  /** Padding of the card body; numbers are treated as px. When unset, bodyStyle / default padding applies */
  padding: string | number

  /** Enable hover feedback: darker border and weak shadow (150ms transition) */
  interactive: boolean

  $slots: CardSlots
}
