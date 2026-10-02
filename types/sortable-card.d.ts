import { VNode } from 'vue'
import { RumoUIComponent } from './component'

export interface SortableCardSlots {
  /** Replaces the default grip content */
  handle: VNode[]

  /** Card header area above the body */
  header: VNode[]

  /** Card body */
  default: VNode[]

  [key: string]: any
}

/** Draggable card shell (handle-only drag, pointer events) */
export declare class RumoSortableCard extends RumoUIComponent {
  /** Current index in the consumer-maintained list */
  index: number

  /** Disable dragging */
  disabled: boolean

  /** Whether the drag handle is rendered */
  handle: boolean

  $slots: SortableCardSlots

  /** Fired when the pressed handle starts a drag */
  $emit(event: 'drag-start'): void

  /** Fired when the drag ends (pointer released or cancelled) */
  $emit(event: 'drag-end'): void

  /** Fired when the drag target index changes; consumer reorders the array */
  $emit(event: 'move', fromIndex: number, toIndex: number): void
}
