import { RumoUIComponent } from '../component'

export type WatermarkFontType = {
  color?: string
  fontSize?: number | string
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  fontFamily?: string
  fontGap?: number
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center'
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'
}

/** Watermark Component */
export declare class RumoWatermark extends RumoUIComponent {
  /** The z-index of the appended watermark element */
  zIndex: number

  /** The rotation angle of the watermark */
  rotate: number

  /** The width of the watermark */
  width: number

  /** The height of the watermark */
  height: number

  /** Image source (base64 supported), takes priority over content */
  image: string

  /** Watermark text content */
  content: string | string[]

  /** Text style */
  font: WatermarkFontType

  /** The spacing between watermarks */
  gap: [number, number]

  /** The offset of the watermark from the upper left corner of the container */
  offset: [number, number]
}
