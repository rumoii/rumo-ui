import { VNode } from 'vue'
import { RumoUIComponent } from './component'

export type QuotaBarMode = 'used' | 'remain'
export type QuotaBarTone = 'success' | 'warning' | 'danger'

export interface QuotaBarSlots {
  /** Label on the left of the head row; falls back to the `label` prop */
  label: VNode[]

  /** Extra actions on the right of the head row */
  actions: VNode[]

  [key: string]: VNode[]
}

/** Quota / usage-limit progress bar */
export declare class RumoQuotaBar extends RumoUIComponent {
  /** Label text on the left */
  label: string

  /** Numeric value shown on the right; `valueText` wins when set */
  value: number | string

  /** Custom right-side value text; defaults to `value` */
  valueText: string

  /** Displayed percentage 0-100: used ratio in `used` mode, remaining ratio in `remain` mode */
  percent: number

  /** Fill semantics: used (default) or remaining */
  mode: QuotaBarMode

  /** Pre-formatted reset countdown text; hidden when empty */
  resetAt: string

  /** Pace marker position 0-100; hidden when null */
  pacePercent: number | null

  /** Threshold tone; defaults to auto by usage risk (<80 success, 80-95 warning, >95 danger) */
  tone: QuotaBarTone | ''

  /** Whether the percentage is shown */
  showPercent: boolean

  $slots: QuotaBarSlots
}
