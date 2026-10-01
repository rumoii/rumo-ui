/**
 * ink 适配层 —— 全仓仅此目录与 host/render.ts 允许 import 'ink'
 *
 * 职责:把中立 props(primitives/types.ts)映射到 ink 专有属性。
 * 未来 OpenTUI 换底 = 新增 primitives/opentui/ 并改 primitives/index.ts 的 re-export,业务零改动。
 */
import React from 'react';
import { Box as InkBox, Text as InkText } from 'ink';
import { Spinner } from '@inkjs/ui';
import type { BoxProps, TextProps, SemanticColor } from '../types.js';
import { colors } from '../colors.js';

function toHex(color?: SemanticColor): string | undefined {
  return color ? colors[color].hex : undefined;
}

/** 丢弃 undefined 值键 —— ink Box 用 {...style} 合并默认值,显式 undefined 会覆盖默认(flexDirection 等) */
function definedOnly<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as Partial<T>;
}

export function Box(props: BoxProps): React.ReactElement {
  const {
    flexDirection,
    paddingX,
    paddingY,
    padding,
    marginY,
    marginX,
    marginTop,
    borderStyle,
    borderColor,
    width,
    height,
    flexGrow,
    overflowY,
    children
  } = props;

  // 边框仅在显式要求时出现;默认无边框(有边框会侵占固定高度内容区)
  const inkBorder = borderStyle && borderStyle !== 'none' ? borderStyle : undefined;

  return React.createElement(
    InkBox,
    definedOnly({
      flexDirection,
      paddingX,
      paddingY,
      padding,
      marginY,
      marginX,
      marginTop,
      borderStyle: inkBorder,
      borderColor: toHex(borderColor),
      width,
      height,
      flexGrow,
      overflowY
    }),
    children as React.ReactNode
  );
}

export function Text(props: TextProps): React.ReactElement {
  const { color, bold, dimColor, wrap, children } = props;
  return React.createElement(
    InkText,
    definedOnly({ color: toHex(color), bold, dimColor, wrap }),
    children as React.ReactNode
  );
}

/** 纵向布局容器(全宽列,业务页骨架) */
export function Layout(props: { children?: unknown }): React.ReactElement {
  return React.createElement(InkBox, { flexDirection: 'column', width: '100%' }, props.children as React.ReactNode);
}

/** 加载指示(@inkjs/ui Spinner 适配) */
export function Busy(props: { label?: string }): React.ReactElement {
  return React.createElement(Spinner, { label: props.label ?? '载入中' });
}
