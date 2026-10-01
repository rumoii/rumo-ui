/**
 * 仓库根定位 —— 从模块自身位置上溯(不依赖 cwd,CLI 任意目录可跑)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = path.dirname(fileURLToPath(import.meta.url));

let cached: string | null = null;

/** 返回 rumo-ui 仓库根(含 tokens/tokens.json 与 components.json 的目录) */
export function repoRoot(): string {
  if (cached) return cached;
  let dir = thisDir;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'tokens', 'tokens.json')) && fs.existsSync(path.join(dir, 'components.json'))) {
      cached = dir;
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('[rumo-tui] 无法定位仓库根(缺 tokens/tokens.json 或 components.json)');
}

export function tuiRoot(): string {
  return path.join(repoRoot(), 'tui');
}
