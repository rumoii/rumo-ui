// Uses qrcode@1.5.4 (MIT) — https://github.com/soldair/node-qrcode
import { RumoUIComponent } from './component'
export declare class RumoQr extends RumoUIComponent {
  text: string
  size: number
  margin: number
  ecLevel: 'L' | 'M' | 'Q' | 'H'
  color: { dark: string; light: string }
  logo: string
}
