/**
 * CommandSelect —— 终端全屏模糊匹配搜索列表(§6.2 合同,Web 对应 rumo-command-palette)
 *
 * props 合同:items: Array<{ id, label, detail }>, onSelect: (item) => void
 * 按键:输入即过滤(模糊匹配),↑/↓ 移动,Enter 确认,ESC 退出
 * 扩展属性(组合管道):active(按键归属)、onExit(ESC 通知)、height(窗口行数,防长列表闪烁)
 */
import React, { useMemo, useState } from 'react';
import { Box, Text, useKeyInput } from '../primitives/index.js';
import type { KeyInput } from '../primitives/index.js';
import { fuzzyFilter } from '../lib/fuzzy.js';

export interface CommandItem {
  id: string;
  label: string;
  detail?: string;
}

export interface CommandSelectProps {
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  /** 组合扩展:仅 active 实例响应按键(默认 true) */
  active?: boolean;
  /** 组合扩展:ESC 退出通知 */
  onExit?: () => void;
  /** 组合扩展:可见行数窗口(默认 12,按终端行数收敛防闪烁) */
  height?: number;
}

export function CommandSelect(props: CommandSelectProps): React.ReactElement {
  const { items, onSelect, active = true, onExit, height = 12 } = props;
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const filtered = useMemo(() => fuzzyFilter(query, items, (it) => `${it.label} ${it.detail ?? ''}`), [query, items]);

  // 窗口化:只渲染 [start, start+height),长列表不再全量重绘
  const start = Math.max(0, Math.min(cursor - Math.floor(height / 2), Math.max(0, filtered.length - height)));
  const windowed = filtered.slice(start, start + height);

  useKeyInput((key: KeyInput) => {
    if (!active) return;

    if (key.return) {
      const hit = filtered[cursor];
      if (hit) onSelect(hit);
      return;
    }
    if (key.escape) {
      if (onExit) onExit();
      return;
    }
    if (key.upArrow) {
      setCursor((c) => (filtered.length === 0 ? 0 : (c - 1 + filtered.length) % filtered.length));
      return;
    }
    if (key.downArrow) {
      setCursor((c) => (filtered.length === 0 ? 0 : (c + 1) % filtered.length));
      return;
    }
    if (key.backspace) {
      setQuery((q) => {
        const next = q.slice(0, -1);
        setCursor(0);
        return next;
      });
      return;
    }
    if (key.ctrl || key.tab) return;
    if (key.input) {
      setQuery((q) => {
        const next = q + key.input;
        setCursor(0);
        return next;
      });
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="primary" padding={1} flexGrow={1}>
      <Box>
        <Text color="primary" bold>
          {'⌕ '}
        </Text>
        <Text>{query}</Text>
        <Text color="primary">▌</Text>
        <Text dimColor color="textMuted">
          {`  ${filtered.length}/${items.length}  ↑↓ 移动  Enter 确认  ESC 退出`}
        </Text>
      </Box>
      <Box flexDirection="column" marginTop={1}>
        {windowed.map((item, i) => {
          const absolute = start + i;
          const isActiveItem = absolute === cursor;
          return (
            <Box key={item.id}>
              <Text color={isActiveItem ? 'primary' : 'textRegular'} bold={isActiveItem}>
                {isActiveItem ? '❯ ' : '  '}
              </Text>
              <Text color={isActiveItem ? 'primary' : 'textPrimary'} bold={isActiveItem} wrap="truncate">
                {item.label}
              </Text>
              {item.detail ? (
                <Text dimColor color="textMuted" wrap="truncate">
                  {`  ${item.detail}`}
                </Text>
              ) : null}
            </Box>
          );
        })}
        {filtered.length === 0 ? (
          <Text dimColor color="textMuted">
            {`无匹配项: ${query}`}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}
