// Derived from splitpanes@v2.4.1/src/components/splitpanes/splitpanes.vue (MIT) — https://github.com/antoniandre/splitpanes @c668ab3b2517e59201e613c198381443bf43c2b6
import { RumoUIComponent } from './component'
export interface SplitpaneState { min: number; max: number; size: number }
export declare class RumoSplitpanes extends RumoUIComponent {
  horizontal: boolean
  pushOtherPanes: boolean
  dblClickSplitter: boolean
  rtl: boolean
  firstSplitter: boolean
}
