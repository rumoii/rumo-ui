import { VNode } from 'vue'
import { RumoUIComponent } from './component'

/** Delta tone of RumoStatTile */
export type StatTileTone = '' | 'success' | 'warning' | 'danger'

export interface StatTileSlots {
  /** Value area; falls back to the `value` prop */
  default: VNode[]

  /** Label content; falls back to the `label` prop */
  label: VNode[]

  /** Icon area above the value */
  icon: VNode[]

  [key: string]: VNode[]
}

export interface StatGridSlots {
  /** Stat tiles */
  default: VNode[]

  [key: string]: VNode[]
}

/** Metric stat tile */
export declare class RumoStatTile extends RumoUIComponent {
  /** Metric name */
  label: string

  /** Metric value */
  value: string | number

  /** Tooltip text on the value and label */
  hint: string

  /** Change caption, e.g. "+12%" */
  delta: string

  /** Delta tone; empty uses the neutral color */
  tone: StatTileTone

  /** Whether the value area shows a loading skeleton */
  loading: boolean

  $slots: StatTileSlots
}

/** Responsive stat-tile grid */
export declare class RumoStatGrid extends RumoUIComponent {
  /** Column count 1-8; falls back to 2 columns on narrow viewports */
  columns: number

  /** Grid gap; numbers are px */
  gap: number | string

  $slots: StatGridSlots
}
