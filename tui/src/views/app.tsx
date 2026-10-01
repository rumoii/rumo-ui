/**
 * TUI 根应用 —— 模式状态机:home | inventory | codegen
 *
 * 按键归属:同一时刻只有一个交互组件 active(LogStream 恒为展示态)。
 * 首页 TerminalPrompt 命令:list 进清单 / help 帮助 / quit 退出。
 */
import React, { useState } from 'react';
import { Box, Text, useKeyInput, useExit } from '../primitives/index.js';
import { TerminalPrompt } from '../components/index.js';
import { InventoryView } from './inventory.js';
import { CodegenView } from './codegen.js';
import type { CatalogItem } from '../catalog/index.js';

type Mode = 'home' | 'inventory' | 'codegen';

export function App(): React.ReactElement {
  const [mode, setMode] = useState<Mode>('home');
  const [history, setHistory] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ item: CatalogItem; code: string; from: Mode } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { exit } = useExit();

  // 根级按键:Ctrl+C(raw mode 下为 \x03 字节)收敛到退出;其余按键归子组件 active 实例
  useKeyInput((key) => {
    if (key.input === '\u0003' || (key.ctrl && key.input === 'c')) {
      exit();
    }
  });

  return (
    <Box flexDirection="column" width="100%" padding={1}>
      <Box>
        <Text color="primary" bold>
          rumo TUI
        </Text>
        <Text dimColor color="textMuted">
          {'  组件检索 / 代码模板导出  (quit 退出)'}
        </Text>
      </Box>
      {mode === 'home' ? (
        <Box flexDirection="column" marginTop={1}>
          <Text color="textRegular">
            {helpOpen
              ? '命令:list 组件清单 | snippet <名> 打印片段 | help 帮助 | quit 退出'
              : '命令:list 组件清单 | help 帮助 | quit 退出'}
          </Text>
          <Box marginTop={1}>
            <TerminalPrompt
              history={history}
              prefix="rumo> "
              completions={['list', 'help', 'quit', 'snippet ']}
              onSubmit={(cmd) => {
                setHistory((h) => [...h, cmd]);
                const [verb, ...rest] = cmd.split(/\s+/);
                if (verb === 'list') {
                  setMessage('');
                  setMode('inventory');
                  return;
                }
                if (verb === 'help') {
                  setHelpOpen((v) => !v);
                  return;
                }
                if (verb === 'quit' || verb === 'exit' || verb === 'q') {
                  exit();
                  return;
                }
                if (verb === 'snippet' && rest[0]) {
                  // 快捷路径:直接进 codegen(与清单选中同路径)
                  void import('../catalog/index.js').then(({ findCatalogItem, snippetFor }) => {
                    const item = findCatalogItem(rest[0]);
                    if (!item) {
                      setMessage(`未找到组件: ${rest[0]}(可用 list 或 npm run tui -- --list 查询)`);
                      return;
                    }
                    setMessage('');
                    setSelected({ item, code: snippetFor(item).code, from: 'home' });
                    setMode('codegen');
                  });
                  return;
                }
                setMessage(`未知命令: ${cmd}(可用: list | snippet <名> | help | quit)`);
              }}
            />
          </Box>
          {message ? (
            <Box marginTop={1}>
              <Text color="warning">{message}</Text>
            </Box>
          ) : null}
        </Box>
      ) : null}
      {mode === 'inventory' ? (
        <InventoryView
          onOpenCodegen={(item, code) => {
            setSelected({ item, code, from: 'inventory' });
            setMode('codegen');
          }}
          onBack={() => setMode('home')}
        />
      ) : null}
      {mode === 'codegen' && selected ? (
        <CodegenView item={selected.item} code={selected.code} onBack={() => setMode(selected.from)} />
      ) : null}
    </Box>
  );
}
