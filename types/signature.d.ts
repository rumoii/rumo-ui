// Derived from vue-signature-pad/src/components/VueSignaturePad.vue (MIT) — https://github.com/neighborhood999/vue-signature-pad @0473c2ada300c776a139ac71c7ff6ac819160c48
// Uses signature_pad@4.2.0 (MIT) — https://github.com/szimek/signature_pad
import { RumoUIComponent } from './component'
export declare class RumoSignature extends RumoUIComponent {
  penColor: string
  bgColor: string
  width: number | string
  height: number | string
  dotSize: number
  save(): string
  clear(): void
  undo(): void
}
