/**
 * 组件文档代码片段提取 —— 零维护来源:examples/docs/zh-CN/*.md
 *
 * 回退链:
 *   1. 本组件文档(优先 <!-- snippet --> 推荐 demo,无标记取首例)→ source: 'docs'
 *   2. 兄弟文档:全量扫 zh-CN/*.md,取首个**内容含 <rumo-<id> 标签**的 :::demo
 *      (子组件如 checkbox-group 无独立文档,示例写在 checkbox.md)→ source: 'shared' + from
 *   3. 全库无示例 → 占位模板(明确标注,不冒充真实 demo)→ source: 'stub'
 */
import fs from 'node:fs';
import path from 'node:path';
import type { SnippetResult } from './types.js';

// \s* 吃掉任意空白/换行(含 CRLF 空行残留的孤立 \r);围栏语言名前允许空格(如 ``` html)
const DEMO_G = /^(?:(<!-- snippet -->)[ \t]*\r?\n)?:::demo[^\n]*\r?\n\s*```[ \t]*(?:html|vue)[ \t]*\r?\n([\s\S]*?)```/gm;

function clean(code: string): string {
  // 行尾归一化:仓库 md 为 CRLF,残留 \r 会被终端当作"回行首"控制符,
  // 使 ink 整帧错位覆写(花屏)。提取片段与 export 落盘文件都不带 CR。
  return code.replace(/\r\n?/g, '\n').replace(/\s+$/, '') + '\n';
}

/** 文档中全部 :::demo 片段(按出现序) */
function allDemos(md: string): Array<{ code: string; recommended: boolean }> {
  const out: Array<{ code: string; recommended: boolean }> = [];
  DEMO_G.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = DEMO_G.exec(md)) !== null) {
    if (m[2].trim()) out.push({ code: clean(m[2]), recommended: Boolean(m[1]) });
  }
  return out;
}

/** demo 可混排模板、script、style;导出统一为单根 Vue 2 SFC。 */
function toSfc(code: string): string {
  const blocks: string[] = [];
  let hasScript = false;
  let template = clean(code).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, (block, tag: string) => {
    if (tag.toLowerCase() === 'script') hasScript = true;
    blocks.push(block);
    return '';
  }).trim();
  const outer = template.match(/^<template\s*>([\s\S]*)<\/template\s*>$/i);
  if (outer) template = outer[1].trim();
  if (!hasScript) blocks.unshift('<script>\nexport default {};\n</script>');
  return `<template>\n<div>\n${template}\n</div>\n</template>\n\n${blocks.join('\n\n')}\n`;
}

/** 含目标组件标签的首个 demo;<rumo-id 后必须是空白/>结尾,防 checkbox 误配 checkbox-group */
function demoForTag(md: string, id: string): string | null {
  const tagRe = new RegExp(`<rumo-${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[\\s/>])`);
  const demos = allDemos(md).filter((demo) => tagRe.test(demo.code));
  return (demos.find((demo) => demo.recommended) ?? demos[0])?.code ?? null;
}

export function extractSnippet(id: string, docsPath: string, repoRootDir: string): SnippetResult {
  // 1. 本组件文档
  const abs = path.isAbsolute(docsPath) ? docsPath : path.join(repoRootDir, docsPath);
  if (fs.existsSync(abs)) {
    const md = fs.readFileSync(abs, 'utf8');
    const demos = allDemos(md);
    if (demos.length > 0) {
      return { id, code: toSfc((demos.find((demo) => demo.recommended) ?? demos[0]).code), source: 'docs' };
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
        return { id, code: toSfc(hit), source: 'shared', from: rel };
      }
    }
  }

  // 3. 占位
  return {
    id,
    code: toSfc(`<!-- 文档缺失或无 :::demo,已生成占位模板 -->\n<rumo-${id} />`),
    source: 'stub'
  };
}
