/** 目录与代码片段的中立数据形态 */

export interface CatalogItem {
  /** 组件短名(与 components.json 键一致),如 button */
  id: string;
  /** 展示名,如 "Button 按钮" */
  label: string;
  /** 分组名(nav.config.json groupName),如 Basic */
  group: string;
  /** 包路径,如 ./packages/button/index.js */
  pkgPath: string;
  /** 文档路径(可能不存在) */
  docsPath: string;
  /** 文档是否存在(决定代码生成走真实 demo 还是占位模板) */
  hasDocs: boolean;
}

export interface SnippetResult {
  id: string;
  /** 可导出的 Vue 片段文本 */
  code: string;
  /** 来源:docs(文档首个 :::demo)或 stub(占位模板) */
  source: 'docs' | 'stub';
}
