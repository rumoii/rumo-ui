import { RumoUIComponent } from './component'

/** One data segment of RumoStackBar */
export interface StackBarSegment {
  /** Unique key; defaults to the index */
  key?: string | number

  /** Display label */
  label: string

  /** Numeric value */
  value: number

  /** Segment color; defaults to the series palette cycle */
  color?: string
}

/** StackBar Component */
export declare class RumoStackBar extends RumoUIComponent {
  /** Data segments */
  segments: StackBarSegment[]

  /** Declared total; defaults to the sum of segment values */
  total: number | string

  /** Track height in px (number) or any CSS length (string) */
  height: number | string

  /** Whether the legend is rendered */
  showLegend: boolean

  /** Legend position: top / bottom / none */
  legendPosition: 'top' | 'bottom' | 'none'

  /** Custom legend value formatter: (segment, percent) => string */
  formatter: (segment: StackBarSegment, percent: number) => string
}
