/**
 * @rumo/tui-internal 库入口(仓库内工具,不发 npm)
 * 导出三组件与目录/片段 API,供测试与后续扩展复用。
 */
export { LogStream, TerminalPrompt, CommandSelect } from './components/index.js';
export type { LogStreamProps, TerminalPromptProps, CommandSelectProps, CommandItem } from './components/index.js';
export { loadCatalog, findCatalogItem, snippetFor } from './catalog/index.js';
export type { CatalogItem, SnippetResult } from './catalog/index.js';
export { tokens } from './tokens/index.js';
