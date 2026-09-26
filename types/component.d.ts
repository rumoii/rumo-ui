import Vue from 'vue'

/** RumoUI component common definition */
export declare class RumoUIComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

/** Component size definition for button, input, etc */
export type RumoUIComponentSize = 'large' | 'medium' | 'small' | 'mini'

/** Horizontal alignment */
export type RumoUIHorizontalAlignment = 'left' | 'center' | 'right'
