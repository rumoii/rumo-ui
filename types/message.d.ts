import Vue, {VNode} from 'vue'

export type MessageType = 'success' | 'warning' | 'info' | 'error'

/** Message Component */
export declare class RumoMessageComponent extends Vue {
  /** Close the Loading instance */
  close (): void
}

export interface CloseEventHandler {
  /**
   * Triggers when a message is being closed
   *
   * @param instance The message component that is being closed
   */
  (instance: RumoMessageComponent): void
}

/** Options used in Message */
export interface RumoMessageOptions {
  /** Message text */
  message: string | VNode

  /** Message type */
  type?: MessageType

  /** Custom icon's class, overrides type */
  iconClass?: string

  /** Custom class name for Message */
  customClass?: string

  /** Display duration, millisecond. If set to 0, it will not turn off automatically */
  duration?: number

  /** Whether to show a close button */
  showClose?: boolean

  /** Whether to center the text */
  center?: boolean

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean

  /** Callback function when closed with the message instance as the parameter */
  onClose?: CloseEventHandler
  
  /** Set the distance to the top of viewport. Default is 20 px. */
  offset?: number
  
  /** Set the slot before the close button */
  beforeCloseSlot?: string | VNode
}

export interface RumoMessage {
  /** Show an info message */
  (text: string): RumoMessageComponent

  /** Show message */
  (options: RumoMessageOptions): RumoMessageComponent

  /** Show a success message */
  success (text: string): RumoMessageComponent
  
  /** Show a success message with options */
  success (options: RumoMessageOptions): RumoMessageComponent

  /** Show a warning message */
  warning (text: string): RumoMessageComponent
  
  /** Show a warning message with options */
  warning (options: RumoMessageOptions): RumoMessageComponent

  /** Show an info message */
  info (text: string): RumoMessageComponent
  
  /** Show an info message with options */
  info (options: RumoMessageOptions): RumoMessageComponent

  /** Show an error message */
  error (text: string): RumoMessageComponent
  
  /** Show an error message with options */
  error (options: RumoMessageOptions): RumoMessageComponent
}

declare module 'vue/types/vue' {
  interface Vue {
  /** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
    $message: RumoMessage
  }
}
