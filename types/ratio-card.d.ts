import { VNode } from 'vue'
import { RumoUIComponent } from './component'

/** One detail row of RumoRatioCard */
export interface RatioCardItem {
  /** Unique key; defaults to the index */
  key?: string | number

  /** Display label */
  label: string

  /** Numeric value */
  value: number

  /** Share in percent; defaults to value / total */
  ratio?: number

  /** Row color; defaults to the series palette cycle */
  color?: string
}

export interface RatioCardSlots {
  /** Card header; falls back to the `title` prop */
  header: VNode[]

  /** Per-row icon; scoped with `item`. Falls back to the color square */
  icon: (item: RatioCardItem) => VNode[]

  [key: string]: any
}

/** Ratio / share card with per-item distribution bars */
export declare class RumoRatioCard extends RumoUIComponent {
  /** Card title text */
  title: string

  /** Detail rows: `{ label, value, ratio?, color? }` */
  items: RatioCardItem[]

  /** Declared total; defaults to the sum of item values */
  total: number | string

  /** Right-side value formatter: (item) => string */
  formatter: (item: RatioCardItem) => string

  $slots: RatioCardSlots
}
