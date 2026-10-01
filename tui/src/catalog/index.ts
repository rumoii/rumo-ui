/**
 * 组件目录 —— 只读合并两个既有元数据源(严禁往 components.json 加 tui/ 条目):
 *   - components.json:name → 包路径(Web 线注册表,权威短名)
 *   - examples/nav.config.json:分组与展示标题("Button 按钮" → id 对齐 title 首词小写)
 */
import fs from 'node:fs';
import path from 'node:path';
import { repoRoot } from '../lib/repo-locate.js';
import type { CatalogItem, SnippetResult } from './types.js';
import { extractSnippet } from './docs-extract.js';

interface NavEntry {
  path: string;
  title: string;
}
interface NavGroup {
  groupName: string;
  list: NavEntry[];
}

let cached: Map<string, CatalogItem[]> = new Map();

/** 归一化匹配:忽略连字符/大小写(date-picker ≡ DatePicker ≡ datepicker) */
function normId(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function loadCatalog(root: string = repoRoot()): CatalogItem[] {
  const hit = cached.get(root);
  if (hit) return hit;

  const components = JSON.parse(fs.readFileSync(path.join(root, 'components.json'), 'utf8')) as Record<string, string>;
  const nav = JSON.parse(fs.readFileSync(path.join(root, 'examples', 'nav.config.json'), 'utf8')) as Record<
    string,
    Array<{ name: string; groups?: NavGroup[] }>
  >;

  // 文档文件名索引(小写归一 → 实际相对路径),吸收 kebab/camel 命名差异(infiniteScroll.md 等)
  const docsDir = path.join(root, 'examples', 'docs', 'zh-CN');
  const docsByNorm = new Map<string, string>();
  if (fs.existsSync(docsDir)) {
    for (const f of fs.readdirSync(docsDir)) {
      if (f.endsWith('.md')) {
        docsByNorm.set(normId(f.slice(0, -3)), path.posix.join('examples/docs/zh-CN', f));
      }
    }
  }

  // components.json 键的归一索引(date-picker → datepicker)
  const keyByNorm = new Map<string, string>();
  for (const k of Object.keys(components)) keyByNorm.set(normId(k), k);

  const resolve = (word: string): { id: string; pkgPath: string; docsPath: string; hasDocs: boolean } | null => {
    const n = normId(word);
    if (!n) return null;
    const regKey = keyByNorm.get(n);
    const docsPath = docsByNorm.get(n);
    // 有注册或有文档才算数(有文档无注册的如 datetime-picker 也收录,pkgPath 置未注册标注)
    if (!regKey && !docsPath) return null;
    return {
      id: regKey ?? word.toLowerCase(),
      pkgPath: regKey ? components[regKey] : '(未注册于 components.json)',
      docsPath: docsPath ?? path.posix.join('examples/docs/zh-CN', `${regKey ?? word.toLowerCase()}.md`),
      hasDocs: Boolean(docsPath)
    };
  };

  // nav zh-CN 的「组件」节含 groups:list[].title 形如 "Button 按钮"
  const groups = nav['zh-CN'].flatMap((sec) => sec.groups ?? []);
  const byId = new Map<string, CatalogItem>();

  for (const g of groups) {
    for (const entry of g.list) {
      const firstWord = (entry.title || '').trim().split(/\s+/)[0] || '';
      const r = resolve(firstWord);
      if (!r) continue;
      byId.set(r.id, {
        id: r.id,
        label: entry.title,
        group: g.groupName,
        pkgPath: r.pkgPath,
        docsPath: r.docsPath,
        hasDocs: r.hasDocs
      });
    }
  }

  // components.json 里有、nav 未收录的(如有)按「未分组」补尾,保证 --list 全量
  for (const [id, pkgPath] of Object.entries(components)) {
    if (!byId.has(id)) {
      const docsPath = docsByNorm.get(normId(id));
      byId.set(id, {
        id,
        label: id,
        group: '未分组',
        pkgPath,
        docsPath: docsPath ?? path.posix.join('examples/docs/zh-CN', `${id}.md`),
        hasDocs: Boolean(docsPath)
      });
    }
  }

  const list = Array.from(byId.values()).sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id));
  cached.set(root, list);
  return list;
}

export function findCatalogItem(id: string, root: string = repoRoot()): CatalogItem | undefined {
  const q = normId(id);
  return loadCatalog(root).find((it) => normId(it.id) === q || normId(it.label.split(/\s+/)[0] ?? '') === q);
}

export function snippetFor(item: CatalogItem, root: string = repoRoot()): SnippetResult {
  return extractSnippet(item.id, item.docsPath, root);
}

export type { CatalogItem, SnippetResult } from './types.js';
