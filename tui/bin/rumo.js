#!/usr/bin/env node
/**
 * rumo TUI 启动器(纯 Node、零依赖、ESM —— tui/package.json 为 type:module)
 *
 * 职责:Node 版本守卫 → tsx 存在检查 → spawn 实际 CLI(tui/src/cli.tsx)→ 转发退出码。
 * 不 import ink/tsx 本身,保证在依赖缺失时也能给出可读报错而非模块解析崩溃。
 *
 * Node 守卫:方案合同 engines 写 ">=18.0.0"(照抄),但 ink 7 运行时实际要求 Node >= 22,
 * 故在此加实际下限守卫,见 tui/README.md。
 */
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const tuiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(tuiRoot, '..');

// 1. Node >= 22 守卫(ink 7 硬性要求)
const nodeMajor = Number(process.versions.node.split('.')[0]);
if (Number.isNaN(nodeMajor) || nodeMajor < 22) {
  process.stderr.write(
    `[rumo-tui] 需要 Node.js >= 22(当前 ${process.versions.node})。` +
      'ink 7 运行时硬性要求 Node 22+,请升级 Node 后重试。\n'
  );
  process.exit(1);
}

// 2. tsx 存在检查(依赖是否已装)
const tsxCli = path.join(tuiRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
if (!fs.existsSync(tsxCli)) {
  process.stderr.write('[rumo-tui] 未找到 tui/node_modules/tsx,请先执行: npm --prefix tui install\n');
  process.exit(1);
}

const cliEntry = path.join(tuiRoot, 'src', 'cli.tsx');
if (!fs.existsSync(cliEntry)) {
  process.stderr.write(`[rumo-tui] CLI 入口缺失: ${cliEntry}\n`);
  process.exit(1);
}

// 3. spawn 实际 CLI。shell:false + 传数组参数,避免 Windows 引号转义问题;
//    stdio: inherit 保留原始 TTY(isTTY 嗅探依赖真实 stdio)。
const child = spawn(process.execPath, [tsxCli, cliEntry, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: repoRoot,
  shell: false
});

child.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});
child.on('error', (err) => {
  process.stderr.write(`[rumo-tui] 启动失败: ${err && err.message ? err.message : err}\n`);
  process.exit(1);
});

// 转发终止信号给子进程,防父亡子孤
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    try {
      child.kill(sig);
    } catch {
      /* 子进程可能已退出 */
    }
  });
}
