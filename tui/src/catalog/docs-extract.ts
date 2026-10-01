/**
 * 组件文档代码片段提取 —— 零维护来源:examples/docs/zh-CN/*.md
 *
 * 回退链:
 *   1. 本组件文档(:::demo 后首个 html/vue 围栏,镜像 build/md-loader/containers.js 规则)→ source: 'docs'
 *   2. 兄弟文档:全量扫 zh-CN/*.md,取首个**内容含 <rumo-<id> 标签**的 :::demo
 *      (子组件如 checkbox-group 无独立文档,示例写在 checkbox.md)→ source: 'shared' + from
 *   3. 全库无示例 → 占位模板(明确标注,不冒充真实 demo)→ source: 'stub'
 */
import fs from 'node:fs';
import path from 'node:path';
import type { SnippetResult } from './types.js';

// \s* 吃掉任意空白/换行(含 CRLF 空行残留的孤立 \r);围栏语言名前允许空格(如 ``` html)
const DEMO_G = /:::demo[^\n]*\r?\n\s*```[ \t]*(?:html|vue)[ \t]*\r?\n([\s\S]*?)```/g;

function clean(code: string): string {
  return code.replace(/\s+$/, '') + '\n';
}

/** 文档中全部 :::demo 片段(按出现序) */
function allDemos(md: string): string[] {
  const out: string[] = [];
  DEMO_G.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = DEMO_G.exec(md)) !== null) {
    if (m[1].trim()) out.push(clean(m[1]));
  }
  return out;
}

/** 含目标组件标签的首个 demo;<rumo-id 后必须是空白/>结尾,防 checkbox 误配 checkbox-group */
function demoForTag(md: string, id: string): string | null {
  const tagRe = new RegExp(`<rumo-${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[\\s/>])`);
  for (const code of allDemos(md)) {
    if (tagRe.test(code)) return code;
  }
  return null;
}

export function extractSnippet(id: string, docsPath: string, repoRootDir: string): SnippetResult {
  // 1. 本组件文档
  const abs = path.isAbsolute(docsPath) ? docsPath : path.join(repoRootDir, docsPath);
  if (fs.existsSync(abs)) {
    const md = fs.readFileSync(abs, 'utf8');
    const demos = allDemos(md);
    if (demos.length > 0) {
      return { id, code: demos[0], source: 'docs' };
    }
  }

  // 2. 兄弟文档:含本组件标签的 demo(文件名序保证确定性)
  const docsDir = path.join(repoRootDir, 'examples', 'docs', 'zh-CN');
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md')).sort();
    for (const f of files) {
      const rel = path.posix.join('examples/docs/zh-CN', f);
      const absF = path.join(docsDir, f);
      // 本组件文档已在第 1 步看过(无命中标签时这里会重复扫,无害且保证不漏)
      const md = fs.readFileSync(absF, 'utf8');
      const hit = demoForTag(md, id);
      if (hit) {
        return { id, code: hit, source: 'shared', from: rel };
      }
    }
  }

  // 3. 占位
  return {
    id,
    code: `<!-- 文档缺失或无 :::demo,已生成占位模板 -->\n<template>\n  <rumo-${id} />\n</template>\n`,
    source: 'stub'
  };
}
