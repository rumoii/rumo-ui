/**
 * 语义色 → 色值,唯一来源是 tokens 生成物(tui/src/tokens/index.ts)
 *
 * 红线:严禁在此或任何 tui/src/** 业务代码中硬编码共享色值(门禁 G3 强制)。
 * hex 供 ink(真彩)使用;ansi256 供未来降级渲染器/OpenTUI 使用。
 */
import { tokens } from '../tokens/index.js';
import type { SemanticColor } from './types.js';

export interface ColorValue {
  hex: string;
  ansi256: number;
}

export const colors: Record<SemanticColor, ColorValue> = {
  primary: { hex: tokens.color.primary.hex, ansi256: tokens.color.primary.ansi256 },
  success: { hex: tokens.color.success.hex, ansi256: tokens.color.success.ansi256 },
  warning: { hex: tokens.color.warning.hex, ansi256: tokens.color.warning.ansi256 },
  danger: { hex: tokens.color.danger.hex, ansi256: tokens.color.danger.ansi256 },
  info: { hex: tokens.color.info.hex, ansi256: tokens.color.info.ansi256 },
  textPrimary: { hex: tokens.color.text.primary.hex, ansi256: tokens.color.text.primary.ansi256 },
  textRegular: { hex: tokens.color.text.regular.hex, ansi256: tokens.color.text.regular.ansi256 },
  textMuted: { hex: tokens.color.text.muted.hex, ansi256: tokens.color.text.muted.ansi256 }
};

/** 间距(px 为 Web 对照, 终端渲染用 ch) */
export const spacing = tokens.spacing;

/** TUI 边框风格(round,来自 tokens.border.style.tui) */
export const borderStyleTui = tokens.border.style.tui;
