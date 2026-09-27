// Derived from element-plus/packages/components/statistic/src/statistic.ts (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import { RumoUIComponent } from './component'
export declare class RumoStatistic extends RumoUIComponent {
  value: number | { valueOf(): number }
  formatter: (value: number) => string | number
  precision: number
  decimalSeparator: string
  groupSeparator: string
  title: string
  prefix: string
  suffix: string
  valueStyle: string | object
  displayValue: string | number
}
