import { VNode } from 'vue'
import { RumoUIComponent } from './component'

/** One rank row of RumoRankList */
export interface RankListItem {
  /** Rank number; defaults to the index + 1 */
  rank?: number

  /** Display name */
  name: string

  /** Row value; numeric when the inline bar should scale by value */
  value: number | string

  /** Share 0-100; drives the bar and the percent caption when present */
  percent?: number

  /** Bar color; defaults to the accent color */
  color?: string
}

export interface RankListSlots {
  /** Badge area above the rows */
  badge: VNode[]

  [key: string]: VNode[]
}

/** Rank list component */
export declare class RumoRankList extends RumoUIComponent {
  /** Rank rows */
  items: RankListItem[]

  /** How many rows are shown */
  max: number

  /** Value caption formatter: (item) => string */
  valueText: (item: RankListItem) => string

  /** Whether the inline share bar is rendered */
  showBar: boolean

  $slots: RankListSlots
}
