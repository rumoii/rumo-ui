/**
 * CLI 入口(npm run tui → bin/rumo.js → tsx 本文件)
 *
 * 分支纪律(rumo-lifecycle-safety 状态机):
 *   created → (resolveRunMode) → static 路径直接 runStatic 退出 | interactive 路径
 *   interactive: starting → running(ink 渲染)→ teardown 六步 → exited
 * 静态路径永不 import ink(动态 import 仅在 interactive 分支)。
 */
import { resolveRunMode } from './host/tty.js';
import { runStatic } from './host/static-runner.js';
import { CliSession } from './host/lifecycle.js';

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const session = new CliSession();

  // 带 flag(--list/--snippet/...)一律走静态面(TTY 下也生效);仅无参且交互 TTY 才进全屏
  const hasFlags = argv.some((a) => a.startsWith('-'));
  if (hasFlags || resolveRunMode() === 'static') {
    const code = runStatic(argv);
    session.setExitCode(code);
    process.exitCode = session.teardown();
    return;
  }

  // interactive:动态 import 渲染栈(ink 等)
  session.markRunning();
  const [{ renderRoot }, { App }, React] = await Promise.all([
    import('./host/render.js'),
    import('./views/app.js'),
    import('react')
  ]);

  const root = renderRoot(React.createElement(App), { session });

  // SIGINT/SIGTERM/ESC 均收敛到同一拆除路径
  const onSignal = () => {
    root.unmount();
    process.exitCode = session.teardown();
    process.exit();
  };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  await root.waitUntilExit();
  process.exitCode = session.teardown();
}

main().catch((e) => {
  process.stderr.write(`[rumo-tui] 启动失败: ${e instanceof Error ? e.stack || e.message : String(e)}\n`);
  process.exit(1);
});
