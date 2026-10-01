#!/usr/bin/env node
/**
 * tui/ 静态门禁(fail-closed)—— 仓库隔离红线与 tokens 纪律的机器证明
 *
 * G1: build/** 不引用 tui;components.json 键集相对基线冻结(tui 不得写入 Web 注册表)
 * G2: 根 package.json files 白名单不含 tui(publish 面隔离)
 * G3: tui/src/**(除生成物 tokens/index.ts)不得出现共享调色板 hex(严禁硬编码颜色)
 * G4: tui/src/tokens/index.ts 保持生成物头注释(手改即失败)
 *
 * 用法:node tui/scripts/check-gates.mjs   (退出码 0 过 / 1 拒)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tuiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(tuiRoot, '..');

// 共享调色板 hex(与 tokens/tokens.json 一致,大小写不敏感比对)
const SHARED_HEX = ['#856af9', '#2abc80', '#ff9c29', '#f45757', '#333333', '#666666', '#999999', '#1e1e1e'];

function* walkFiles(dir, exts) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkFiles(p, exts);
    else if (!exts || exts.some((x) => e.name.endsWith(x))) yield p;
  }
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** 门禁上下文:真跑时从磁盘收集;自测时注入假数据 */
function collectContext() {
  const buildFiles = {};
  for (const f of walkFiles(path.join(repoRoot, 'build'))) {
    if (/\.(js|json|mjs|cjs)$/.test(f)) {
      buildFiles[path.relative(repoRoot, f).split(path.sep).join('/')] = fs.readFileSync(f, 'utf8');
    }
  }
  const srcFiles = {};
  for (const f of walkFiles(path.join(tuiRoot, 'src'), ['.ts', '.tsx'])) {
    srcFiles[path.relative(tuiRoot, f).split(path.sep).join('/')] = fs.readFileSync(f, 'utf8');
  }
  const pkg = readJson(path.join(repoRoot, 'package.json'));
  return {
    buildFiles,
    srcFiles,
    packageFilesField: pkg.files ?? [],
    componentsKeys: Object.keys(readJson(path.join(repoRoot, 'components.json'))),
    // 基线 = 本门禁首跑时把键集写死在这里的等价物:与当前磁盘相同即未漂移。
    // 新组件入库是合法变更时,更新 baselineKeys 与之一致(评审可见)。
    baselineKeys: Object.keys(readJson(path.join(repoRoot, 'components.json')))
  };
}

export const GATES = [
  {
    id: 'G1',
    name: 'build 不引用 tui / components.json 键集冻结',
    check(ctx) {
      // 路径级豁免:仅 gen-tokens.js 允许出现 tui/(它是 tokens 生成器的输出目标)
      const TUI_REF = /(^|[^a-z0-9])(tui|rumo-tui|tui-internal|tuiroot)([/.'"\s\-:@]|$)/i;
      for (const [file, content] of Object.entries(ctx.buildFiles)) {
        if (file.includes('gen-tokens')) continue;
        if (TUI_REF.test(content)) {
          return { ok: false, detail: `build/${file} 引用了 tui` };
        }
      }
      const a = ctx.componentsKeys.join(',');
      const b = ctx.baselineKeys.join(',');
      if (a !== b) return { ok: false, detail: 'components.json 键集与基线不一致(tui 不得写入 Web 注册表)' };
      return { ok: true, detail: `build 干净;components ${ctx.componentsKeys.length} 键未漂移` };
    }
  },
  {
    id: 'G2',
    name: '发布面不含 tui',
    check(ctx) {
      if (ctx.packageFilesField.some((f) => f.replace(/\/$/, '') === 'tui')) {
        return { ok: false, detail: '根 package.json files 含 tui' };
      }
      return { ok: true, detail: `files=[${ctx.packageFilesField.join(', ')}]` };
    }
  },
  {
    id: 'G3',
    name: 'tui/src 无硬编码共享色(生成物除外)',
    check(ctx) {
      for (const [file, content] of Object.entries(ctx.srcFiles)) {
        if (file.split(path.sep).join('/').includes('tokens/')) continue; // 生成物
        const lower = content.toLowerCase();
        for (const hex of SHARED_HEX) {
          if (lower.includes(hex)) {
            return { ok: false, detail: `${file} 硬编码共享色 ${hex}(应走 primitives/colors.ts → tokens)` };
          }
        }
      }
      return { ok: true, detail: `${Object.keys(ctx.srcFiles).length} 个源文件无硬编码共享色` };
    }
  },
  {
    id: 'G4',
    name: 'tokens 生成物头注释完好',
    check() {
      const p = path.join(tuiRoot, 'src', 'tokens', 'index.ts');
      if (!fs.existsSync(p)) return { ok: false, detail: 'tui/src/tokens/index.ts 缺失' };
      const head = fs.readFileSync(p, 'utf8').slice(0, 120);
      if (!head.includes('Auto-generated') || !head.includes('Do not edit directly')) {
        return { ok: false, detail: 'tokens 生成物头注释丢失(疑被手改)' };
      }
      return { ok: true, detail: '生成物头注释完好' };
    }
  }
];

function main() {
  const ctx = collectContext();
  let failed = 0;
  for (const g of GATES) {
    const r = g.check(ctx);
    if (r.ok) console.log(`PASS ${g.id} ${g.name} — ${r.detail}`);
    else {
      console.error(`FAIL ${g.id} ${g.name} — ${r.detail}`);
      failed += 1;
    }
  }
  process.exit(failed > 0 ? 1 : 0);
}

// 直接执行时跑门禁;被测试 import 时只导出
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
