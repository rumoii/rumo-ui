/**
 * TerminalPrompt —— 终端命令行交互区(§6.2 合同,Web 对应 rumo-terminal)
 *
 * props 合同:onSubmit: (cmd) => void, history: string[], prefix?: string
 * 按键:↑/↓ 历史翻页(草稿保留),Enter 提交
 * 扩展属性(组合管道):active(按键归属)、completions(Tab 补全候选,默认取 history)
 */
import React, { useState } from 'react';
import { Box, Text, useKeyInput } from '../primitives/index.js';
import type { KeyInput } from '../primitives/index.js';

export interface TerminalPromptProps {
  onSubmit: (cmd: string) => void;
  history: string[];
  prefix?: string;
  /** 组合扩展:仅 active 实例响应按键(默认 true) */
  active?: boolean;
  /** 组合扩展:Tab 补全候选(默认 history) */
  completions?: string[];
}

export function TerminalPrompt(props: TerminalPromptProps): React.ReactElement {
  const { onSubmit, history, prefix = '> ', active = true, completions } = props;
  const [draft, setDraft] = useState('');
  // null = 正在编辑草稿;>=0 = 正在回看 history[i]
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  // ↑ 进历史前暂存草稿,↓ 翻出末尾后还原
  const [draftStash, setDraftStash] = useState('');

  useKeyInput((key: KeyInput) => {
    if (!active) return;

    if (key.return) {
      const cmd = draft.trim();
      if (cmd) onSubmit(cmd);
      setDraft('');
      setHistoryIndex(null);
      return;
    }
    if (key.upArrow) {
      if (history.length === 0) return;
      if (historyIndex === null) setDraftStash(draft); // 暂存当前草稿
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setDraft(history[next]);
      return;
    }
    if (key.downArrow) {
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setDraft(draftStash); // 还原进历史前的草稿
      } else {
        setHistoryIndex(next);
        setDraft(history[next]);
      }
      return;
    }
    if (key.tab) {
      const pool = completions ?? history;
      const hit = pool.find((c) => c.startsWith(draft) && c !== draft);
      if (hit) setDraft(hit);
      return;
    }
    if (key.backspace) {
      setDraft((d) => d.slice(0, -1));
      setHistoryIndex(null);
      return;
    }
    if (key.ctrl || key.escape) return;
    // 控制字符(如 Ctrl+C 的 \x03)不入草稿
    if (key.input && !key.upArrow && !key.downArrow && key.input.charCodeAt(0) >= 32) {
      setDraft((d) => d + key.input);
      setHistoryIndex(null);
    }
  });

  return (
    <Box>
      <Text color="primary" bold>
        {prefix}
      </Text>
      <Text>{draft}</Text>
      <Text color="primary">▌</Text>
    </Box>
  );
}
