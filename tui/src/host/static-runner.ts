/**
 * 非交互静态降级 —— 方案 §4.3 硬性要求(AI Agent / CI / 管道的真实使用面)
 *
 * 纪律:本路径永不 import ink(防挂起),纯逐行 stdout,无全屏刷新/光标序列。
 * 退出码:成功 0;参数错 2;运行失败 1。
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadCatalog, findCatalogItem, snippetFor } from '../catalog/index.js';
import { fuzzyFilter } from '../lib/fuzzy.js';

export interface StaticArgs {
  command: 'help' | 'list' | 'snippet' | 'export' | 'version';
  query?: string;
  name?: string;
  file?: string;
  json: boolean;
}

export function parseArgs(argv: string[]): StaticArgs | { error: string } {
  // 两段式:先扫全量收集标志(支持 --list query --json 任意顺序),再组装结果
  let json = false;
  let command: StaticArgs['command'] | undefined;
  let query: string | undefined;
  let name: string | undefined;
  let file: string | undefined;
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') json = true;
    else if (a === '--help' || a === '-h') {
      if (command) return { error: '命令重复指定' };
      command = 'help';
    } else if (a === '--version' || a === '-v') {
      if (command) return { error: '命令重复指定' };
      command = 'version';
    }
    else if (a === '--list') {
      if (command) return { error: '命令重复指定' };
      command = 'list';
      query = argv[i + 1] && !argv[i + 1].startsWith('-') ? argv[++i] : '';
    } else if (a === '--snippet') {
      if (command) return { error: '命令重复指定' };
      if (!argv[i + 1] || argv[i + 1].startsWith('-')) return { error: '--snippet 需要组件名' };
      command = 'snippet';
      name = argv[++i];
    } else if (a === '--export') {
      if (command) return { error: '命令重复指定' };
      if (!argv[i + 1] || argv[i + 1].startsWith('-')) return { error: '--export 需要组件名' };
      command = 'export';
      name = argv[++i];
      if (argv[i + 1] && !argv[i + 1].startsWith('-')) file = argv[++i];
    } else positional.push(a);
  }

  if (positional.length > 0) return { error: `未知参数: ${positional.join(' ')}` };
  if (!command) return { command: 'help', json };
  // 只带已定义键(undefined 键会破坏 deepEqual 与 JSON 输出整洁)
  const result: StaticArgs = { command, json };
  if (query !== undefined) result.query = query;
  if (name !== undefined) result.name = name;
  if (file !== undefined) result.file = file;
  return result;
}

const USAGE = `rumo TUI —— 组件检索 / 代码模板导出(仓库内工具,不发 npm)

用法:
  npm run tui                    交互界面(需 TTY;非 TTY 自动降级到 --help)
  npm run tui -- --list [q]      列出组件(可选过滤),每行 id\\tlabel\\tgroup\\tpath
  npm run tui -- --snippet <id>  打印组件 Vue 代码片段(首个文档 demo,缺文档为占位模板)
  npm run tui -- --export <id> [文件]
                                 导出代码片段到文件(默认 rumo-<id>-snippet.vue)
  npm run tui -- --json          上述命令以 JSON 输出
  npm run tui -- --help          本帮助
  npm run tui -- --version       版本

退出码: 0 成功 | 1 运行失败 | 2 参数错误`;

export function runStatic(argv: string[]): number {
  const parsed = parseArgs(argv);
  if ('error' in parsed) {
    process.stderr.write(`[rumo-tui] ${parsed.error}\n`);
    process.stderr.write(USAGE + '\n');
    return 2;
  }

  try {
    switch (parsed.command) {
      case 'help':
        process.stdout.write(USAGE + '\n');
        return 0;
      case 'version': {
        process.stdout.write('@rumo/tui-internal 0.1.0\n');
        return 0;
      }
      case 'list': {
        const all = loadCatalog();
        const hits = fuzzyFilter(parsed.query ?? '', all, (it) => `${it.id} ${it.label} ${it.group}`);
        if (parsed.json) {
          process.stdout.write(JSON.stringify(hits, null, 2) + '\n');
        } else {
          for (const it of hits) {
            process.stdout.write(`${it.id}\t${it.label}\t${it.group}\t${it.pkgPath}\n`);
          }
        }
        return 0;
      }
      case 'snippet': {
        const item = findCatalogItem(parsed.name as string);
        if (!item) {
          process.stderr.write(`[rumo-tui] 未找到组件: ${parsed.name}\n`);
          return 1;
        }
        const snip = snippetFor(item);
        if (parsed.json) {
          process.stdout.write(JSON.stringify({ id: item.id, source: snip.source, from: snip.from ?? null, code: snip.code }, null, 2) + '\n');
        } else process.stdout.write(snip.code);
        return 0;
      }
      case 'export': {
        const item = findCatalogItem(parsed.name as string);
        if (!item) {
          process.stderr.write(`[rumo-tui] 未找到组件: ${parsed.name}\n`);
          return 1;
        }
        const snip = snippetFor(item);
        const target = path.resolve(parsed.file ?? `rumo-${item.id}-snippet.vue`);
        fs.writeFileSync(target, snip.code, 'utf8');
        if (parsed.json) process.stdout.write(JSON.stringify({ id: item.id, file: target, source: snip.source }, null, 2) + '\n');
        else process.stdout.write(`${target}\n`);
        return 0;
      }
      default:
        return 2;
    }
  } catch (e) {
    process.stderr.write(`[rumo-tui] ${e instanceof Error ? e.message : String(e)}\n`);
    return 1;
  }
}
