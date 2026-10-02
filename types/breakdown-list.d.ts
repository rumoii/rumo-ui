import { VNode } from 'vue'
import { RumoUIComponent } from './component'

/** One category row of RumoBreakdownList */
export interface BreakdownListRow {
  /** Unique key within its level; defaults to the index */
  key?: string | number

  /** Display label */
  label: string

  /** Numeric value */
  value: number

  /** Share in percent; top-level rows default to value / sum */
  percent?: number

  /** Row color; defaults to the series palette cycle (top-level) */
  color?: string

  /** Nested rows; shown expanded / indented under this row */
  children?: BreakdownListRow[]
}

export interface BreakdownListSlots {
  /** List header above the rows */
  title: VNode[]

  /** Per-row icon; scoped with `row`. Falls back to the color square */
  icon: (row: BreakdownListRow) => VNode[]

  [key: string]: any
}

/** Category breakdown list with share bars and expandable groups */
export declare class RumoBreakdownList extends RumoUIComponent {
  /** Category rows: `{ key?, label, value, percent?, color?, children? }` */
  rows: BreakdownListRow[]

  /** Right-side value formatter: (row) => string */
  formatter: (row: BreakdownListRow) => string

  /** Whether rows with children get an expand toggle; when false children stay visible */
  expandable: boolean

  /** Whether every group starts expanded */
  defaultExpandAll: boolean

  $slots: BreakdownListSlots
}
