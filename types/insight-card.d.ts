import { VNode } from 'vue'
import { RumoUIComponent } from './component'

export type InsightTone = '' | 'success' | 'warning' | 'danger'

/** One insight row of RumoInsightCard */
export interface InsightItem {
  /** Display label */
  label: string

  /** Primary value text (already formatted by the consumer) */
  value: string | number

  /** Optional change / hint badge text */
  delta?: string

  /** Tone applied to `delta` only */
  tone?: InsightTone
}

export interface InsightCardSlots {
  /** Card title; falls back to the `title` prop */
  title: VNode[]

  /** Per-row icon; scoped with `insight` */
  icon: (insight: InsightItem) => VNode[]

  /** Footer note under the list */
  footer: VNode[]

  [key: string]: any
}

/** Insight / key-points card */
export declare class RumoInsightCard extends RumoUIComponent {
  /** Card title text */
  title: string

  /** Insight rows: `{ label, value, delta?, tone? }` */
  insights: InsightItem[]

  /** Loading state: renders skeleton rows instead of the list */
  loading: boolean

  $slots: InsightCardSlots
}
