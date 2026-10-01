/**
 * 视图:组件清单查看 —— CommandSelect 模糊挑组件 + 详情面板 + LogStream 操作日志
 *
 * 目录经动态 import 载入(真实异步边界),载入中显示 Busy 指示。
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, Busy } from '../primitives/index.js';
import { CommandSelect, LogStream } from '../components/index.js';
import type { CommandItem } from '../components/index.js';
import type { CatalogItem } from '../catalog/index.js';

export interface InventoryViewProps {
  onOpenCodegen: (item: CatalogItem, code: string) => void;
  onBack: () => void;
}

export function InventoryView(props: InventoryViewProps): React.ReactElement {
  const { onOpenCodegen, onBack } = props;
  const [catalog, setCatalog] = useState<CatalogItem[] | null>(null);
  const [logLines, setLogLines] = useState<string[]>(['就绪:输入关键字过滤,Enter 进入代码生成,ESC 返回首页']);

  useEffect(() => {
    let alive = true;
    void import('../catalog/index.js').then(({ loadCatalog }) => {
      if (alive) setCatalog(loadCatalog());
    });
    return () => {
      alive = false;
    };
  }, []);

  const items: CommandItem[] = useMemo(
    () => (catalog ?? []).map((it) => ({ id: it.id, label: it.label, detail: `${it.group} · ${it.pkgPath}` })),
    [catalog]
  );

  if (!catalog) {
    return (
      <Box flexDirection="column" width="100%">
        <Busy label="载入组件目录" />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width="100%">
      <Box>
        <Text color="primary" bold>
          组件清单
        </Text>
        <Text dimColor color="textMuted">
          {'  (ESC 返回首页)'}
        </Text>
      </Box>
      <Box marginTop={1} flexGrow={1}>
        <CommandSelect
          items={items}
          height={12}
          onSelect={(item) => {
            const cat = catalog.find((c) => c.id === item.id);
            if (!cat) return;
            setLogLines((ls) => [...ls, `选中: ${cat.label} → 代码生成(${cat.hasDocs ? '文档 demo' : '占位模板'})`]);
            void import('../catalog/index.js').then(({ snippetFor }) => {
              onOpenCodegen(cat, snippetFor(cat).code);
            });
          }}
          onExit={onBack}
        />
      </Box>
      <Box marginTop={1} height={5} borderStyle="round" borderColor="textMuted" padding={1}>
        <LogStream lines={logLines} height={3} follow active={false} />
      </Box>
    </Box>
  );
}
