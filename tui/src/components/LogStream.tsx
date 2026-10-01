/**
 * LogStream —— 终端行流输出(§6.2 合同,Web 对应 rumo-log-viewer)
 *
 * props 合同:lines: string[], height: number, follow: boolean, filter?: string
 * 按键:f 切换跟随模式,c 清屏(隐藏当前已显示行,新行继续出现)
 * 扩展属性(组合管道):active(按键归属)、onClear、onFollowChange
 */
import React, { useMemo, useRef, useState } from 'react';
import { Box, Text, useKeyInput } from '../primitives/index.js';
import type { KeyInput } from '../primitives/index.js';

export interface LogStreamProps {
  lines: string[];
  height: number;
  follow: boolean;
  filter?: string;
  /** 组合扩展:仅 active 实例响应 f/c 键(默认 true) */
  active?: boolean;
  /** 组合扩展:c 清屏时通知宿主 */
  onClear?: () => void;
  /** 组合扩展:f 切换时通知宿主(组件内部持有显示态) */
  onFollowChange?: (follow: boolean) => void;
}

export function LogStream(props: LogStreamProps): React.ReactElement {
  const { lines, height, follow, filter, active = true, onClear, onFollowChange } = props;
  const [followState, setFollowState] = useState(follow);
  // ref 作按键权威:同 tick 连按时闭包不看旧值
  const followRef = useRef(follow);
  const [hiddenCount, setHiddenCount] = useState(0);

  // filter 与清屏窗口:先切掉已清行,再做子串过滤
  const visible = useMemo(() => {
    const start = Math.min(hiddenCount, lines.length);
    const afterClear = lines.slice(start);
    if (!filter) return afterClear;
    const f = filter.toLowerCase();
    return afterClear.filter((l) => l.toLowerCase().includes(f));
  }, [lines, hiddenCount, filter]);

  const window_ = useMemo(() => {
    if (visible.length <= height) return visible;
    return followState ? visible.slice(visible.length - height) : visible.slice(0, height);
  }, [visible, height, followState]);

  useKeyInput((key: KeyInput) => {
    if (!active) return;
    if (key.ctrl || key.upArrow || key.downArrow || key.return || key.escape || key.tab) return;
    if (key.input === 'f') {
      const next = !followRef.current;
      followRef.current = next;
      setFollowState(next);
      if (onFollowChange) onFollowChange(next);
      return;
    }
    if (key.input === 'c') {
      // 清屏 = 隐藏当前已收到的全部行,后续新行继续显示
      setHiddenCount(lines.length);
      if (onClear) onClear();
    }
  });

  return (
    <Box flexDirection="column" height={height} overflowY="hidden">
      {window_.map((line, i) => (
        <Text key={`${i}-${line.slice(0, 24)}`} wrap="truncate">
          {line}
        </Text>
      ))}
      {window_.length === 0 ? <Text dimColor color="textMuted">
        {filter ? `(无匹配行: ${filter})` : '(空)'}
      </Text> : null}
      <Text dimColor color="textMuted">
        {`${followState ? '↓跟随' : '·暂停'}  f 切换跟随  c 清屏  ${visible.length}/${lines.length} 行`}
      </Text>
    </Box>
  );
}
