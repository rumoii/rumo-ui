/**
 * primitives 公共面 —— 业务组件/views 唯一允许的渲染入口
 *
 * 严禁业务代码直接 import 'ink' / '@inkjs/ui'(换底接缝,见 primitives/ink/ 头注释)。
 */
export { Box, Text, Layout, Busy } from './ink/index.js';
export { useKeyInput, useExit } from './ink/hooks.js';
export { colors, spacing, borderStyleTui } from './colors.js';
export type { ColorValue } from './colors.js';
export type {
  BoxProps,
  TextProps,
  KeyInput,
  KeyHandler,
  SemanticColor,
  FlexDirection,
  BorderStyleName,
  WrapMode
} from './types.js';
