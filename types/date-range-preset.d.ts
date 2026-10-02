import { RumoUIComponent } from './component'

/** Preset range definition */
export interface DateRangePresetItem {
  /** Unique key; defaults to the index */
  key?: string

  /** Chip label */
  label: string

  /** Rolling window length in days, ending today */
  days?: number

  /** Explicit range start (YYYY-MM-DD), used when days is absent */
  from?: string

  /** Explicit range end (YYYY-MM-DD), used when days is absent */
  to?: string
}

/** Change payload */
export interface DateRangePresetChange {
  from: string
  to: string
  preset: string
}

/** DateRangePreset Component */
export declare class RumoDateRangePreset extends RumoUIComponent {
  /** Preset definitions */
  presets: DateRangePresetItem[]

  /** Selected range, [from, to] as YYYY-MM-DD strings (v-model) */
  value: string[]

  /** Custom-range trigger label */
  customLabel: string

  /** Cancel button label */
  cancelText: string

  /** Apply button label */
  applyText: string

  /** Force the active preset key; inferred from value when empty */
  activeKey: string
}
