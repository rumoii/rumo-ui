/**
 * 视图:代码生成 —— 片段面板 + TerminalPrompt 命令(export 导出 / back 返回)+ LogStream
 *
 * §10.2 验收路径:「选择指定组件能成功打印或导出代码片段」即此视图。
 */
import React, { useState } from 'react';
import { Box, Text, useExit } from '../primitives/index.js';
import { TerminalPrompt, LogStream } from '../components/index.js';
import type { CatalogItem } from '../catalog/index.js';
import fs from 'node:fs';
import path from 'node:path';

export interface CodegenViewProps {
  item: CatalogItem;
  code: string;
  onBack: () => void;
  /** 导出落盘根(默认 cwd);测试可注入 */
  exportDir?: string;
}

export function CodegenView(props: CodegenViewProps): React.ReactElement {
  const { item, code, onBack, exportDir } = props;
  const { exit } = useExit();
  const [history, setHistory] = useState<string[]>([]);
  const [logLines, setLogLines] = useState<string[]>([
    `已载入 ${item.label}(${item.docsPath})`,
    '命令:print 打印片段 | export [文件名] 导出 | back 返回清单 | quit 退出'
  ]);

  const pushLog = (line: string) => setLogLines((ls) => [...ls, line]);

  return (
    <Box flexDirection="column" width="100%">
      <Box>
        <Text color="primary" bold>
          代码生成
        </Text>
        <Text>
          {`  ${item.label}`}
        </Text>
        <Text dimColor color="textMuted">
          {`  (${item.pkgPath})`}
        </Text>
      </Box>
      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="round"
        borderColor="success"
        padding={1}
        height={12}
        overflowY="hidden"
      >
        {code
          .split('\n')
          .slice(0, 10)
          .map((line, i) => (
            <Text key={i} wrap="truncate">
              {line}
            </Text>
          ))}
        {code.split('\n').length > 10 ? (
          <Text dimColor color="textMuted">
            {`…(共 ${code.split('\n').length} 行,print/export 查看全量)`}
          </Text>
        ) : null}
      </Box>
      <Box marginTop={1}>
        <TerminalPrompt
          history={history}
          prefix="codegen> "
          completions={['print', 'export ', 'back', 'quit']}
          onSubmit={(cmd) => {
            setHistory((h) => [...h, cmd]);
            const [verb, ...rest] = cmd.split(/\s+/);
            if (verb === 'print') {
              pushLog('---- 片段开始 ----');
              for (const line of code.split('\n')) pushLog(line);
              pushLog('---- 片段结束 ----');
              return;
            }
            if (verb === 'export') {
              const file = rest[0] || `rumo-${item.id}-snippet.vue`;
              const target = path.isAbsolute(file) ? file : path.join(exportDir ?? process.cwd(), file);
              try {
                fs.writeFileSync(target, code, 'utf8');
                pushLog(`已导出: ${target}`);
              } catch (e) {
                pushLog(`导出失败: ${e instanceof Error ? e.message : String(e)}`);
              }
              return;
            }
            if (verb === 'back') {
              onBack();
              return;
            }
            if (verb === 'quit' || verb === 'exit' || verb === 'q') {
              exit();
              return;
            }
            pushLog(`未知命令: ${cmd}(可用: print | export [文件名] | back | quit)`);
          }}
        />
      </Box>
      <Box marginTop={1} height={5} borderStyle="round" borderColor="textMuted" padding={1}>
        <LogStream lines={logLines} height={3} follow active={false} />
      </Box>
    </Box>
  );
}
