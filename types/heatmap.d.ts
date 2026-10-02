import { RumoUIComponent } from './component'

/** One day cell of RumoHeatmap */
export interface HeatmapCell {
  /** Calendar date in YYYY-MM-DD */
  date: string

  /** Numeric value of that day */
  value: number
}

/** Payload of RumoHeatmap cell-click */
export interface HeatmapCellClickPayload {
  date: string
  value: number
}

/** Heatmap Component */
export declare class RumoHeatmap extends RumoUIComponent {
  /** Day cells; the calendar range is derived from min/max date */
  cells: HeatmapCell[]

  /** Week start: 0 = Sunday, 1 = Monday */
  weekStartsOn: number

  /** 5-level color scale: empty / low / mid / high / peak */
  palette: string[]

  /** Cell size in px (number) or any CSS length (string) */
  cellSize: number | string

  /** Gap between cells in px (number) or any CSS length (string) */
  gap: number | string

  /** Tooltip text formatter: (date, value) => string */
  formatTooltip: (date: string, value: number) => string

  /** Whether month labels are rendered */
  monthLabels: boolean

  /** Whether weekday labels are rendered */
  weekdayLabels: boolean
}
