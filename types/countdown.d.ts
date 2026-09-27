// Derived from element-plus/packages/components/countdown/src/countdown.ts (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
import { RumoUIComponent } from './component'
export declare class RumoCountdown extends RumoUIComponent {
  value: number | { valueOf(): number }
  format: string
  title: string
  prefix: string
  suffix: string
  valueStyle: string | object
  displayValue: string
}
