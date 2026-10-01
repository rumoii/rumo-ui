/**
 * 渲染器中立的属性类型(OpenTUI 换底预留)
 *
 * 业务组件只依赖本文件的类型,不接触 ink 专有 props;
 * ink 适配层(primitives/ink/)负责把中立类型映射到 ink。
 */

export type FlexDirection = 'row' | 'column';

export type BorderStyleName = 'round' | 'single' | 'double' | 'none';

export type WrapMode = 'wrap' | 'truncate' | 'truncate-end' | 'truncate-middle' | 'truncate-start';

/** 语义色名 → 具体色值由 primitives/colors.ts 从 tokens 导出 */
export type SemanticColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'textPrimary' | 'textRegular' | 'textMuted';

export interface BoxProps {
  flexDirection?: FlexDirection;
  paddingX?: number;
  paddingY?: number;
  padding?: number;
  marginY?: number;
  marginX?: number;
  marginTop?: number;
  borderStyle?: BorderStyleName;
  borderColor?: SemanticColor;
  width?: number | string;
  height?: number | string;
  flexGrow?: number;
  overflowY?: 'visible' | 'hidden';
  children?: unknown;
}

export interface TextProps {
  color?: SemanticColor;
  bold?: boolean;
  dimColor?: boolean;
  wrap?: WrapMode;
  children?: unknown;
}

/** 键入事件(中立形态;ink 适配层负责转换) */
export interface KeyInput {
  /** 可打印字符(无修饰键时) */
  input: string;
  upArrow: boolean;
  downArrow: boolean;
  return: boolean;
  escape: boolean;
  tab: boolean;
  backspace: boolean;
  ctrl: boolean;
}

export type KeyHandler = (key: KeyInput) => void;
