/**
 * 组件文档代码片段提取 —— 零维护来源:examples/docs/zh-CN/<id>.md
 *
 * 提取规则镜像 build/md-loader/containers.js:首个 :::demo 之后的下一个围栏代码块即 demo 内容
 * (md-loader 取 tokens[idx+1].content —— 同一语义,这里用正则取首个 :::demo 后的 ```html 围栏)。
 * 缺文档/缺 demo 时回退占位模板(明确标注,不冒充真实 demo)。
 */
import fs from 'node:fs';
import path from 'node:path';
import type { SnippetResult } from './types.js';

// \s* 吃掉任意空白/换行(含 CRLF 空行残留的孤立 \r);围栏语言名前允许空格(如 ``` html)
const DEMO_RE = /:::demo[^\n]*\r?\n\s*```[ \t]*(?:html|vue)[ \t]*\r?\n([\s\S]*?)```/;

export function extractSnippet(id: string, docsPath: string, repoRootDir: string): SnippetResult {
  const abs = path.isAbsolute(docsPath) ? docsPath : path.join(repoRootDir, docsPath);
  if (fs.existsSync(abs)) {
    const md = fs.readFileSync(abs, 'utf8');
    const m = md.match(DEMO_RE);
    if (m && m[1].trim()) {
      return { id, code: m[1].replace(/\s+$/, '') + '\n', source: 'docs' };
    }
  }
  return {
    id,
    code: `<!-- 文档缺失或无 :::demo,已生成占位模板 -->\n<template>\n  <rumo-${id} />\n</template>\n`,
    source: 'stub'
  };
}
