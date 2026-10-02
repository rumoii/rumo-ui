import { RumoUIComponent } from './component'

/** One normalized bar of RumoTrendChart, emitted by bar-click */
export interface TrendChartSegment {
  /** Index within series */
  index: number

  /** Axis / tooltip title (labels[index] or the index string) */
  label: string

  /** Raw series value; null for gaps */
  value: number | null

  /** Height-driving value (clipped observation or interpolated gap) */
  displayValue: number

  /** Bar kind: real observation, observed zero, gap, or future */
  kind: 'real' | 'zero' | 'missing' | 'future'
}

/** TrendChart Component */
export declare class RumoTrendChart extends RumoUIComponent {
  /** Numeric series; null marks a gap (height interpolated) */
  series: (number | null)[]

  /** Axis / tooltip labels aligned with series; defaults to the index */
  labels: string[]

  /** Index list rendered as weakened gaps */
  missing: number[]

  /** Index list rendered as faint / dashed future bars */
  future: number[]

  /** Value formatter for tooltip (and axis when labels are missing): (value, index) => string */
  formatter: (value: number | null, index: number) => string

  /** Plot height in px (number) or any CSS length (string) */
  height: number | string

  /** Drop outer margin and title when embedded (e.g. inside RumoTrendZoom) */
  embedded: boolean

  /** Show the zoom button; clicking it emits zoom */
  zoomable: boolean
}

/** TrendZoom Component */
export declare class RumoTrendZoom extends RumoUIComponent {
  /** Dialog visibility (v-model / .sync) */
  visible: boolean

  /** Numeric series; null marks a gap */
  series: (number | null)[]

  /** Axis / tooltip labels aligned with series */
  labels: string[]

  /** Index list rendered as weakened gaps */
  missing: number[]

  /** Index list rendered as faint / dashed future bars */
  future: number[]

  /** Value formatter: (value, index) => string */
  formatter: (value: number | null, index: number) => string

  /** Dialog title */
  title: string

  /** Dialog width CSS length */
  width: string
}
