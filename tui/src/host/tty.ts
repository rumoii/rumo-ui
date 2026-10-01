/**
 * TTY 嗅探 —— 方案 §4.3 硬性要求
 *
 * 非交互环境(CI/管道/日志重定向)必须降级静态输出,禁用全屏刷新与光标序列,防挂起。
 * 环境变量 RUMO_TUI_MODE=static|interactive 可强制覆盖(取证/测试用)。
 */

export type RunMode = 'interactive' | 'static';

export function resolveRunMode(env: NodeJS.ProcessEnv = process.env): RunMode {
  const forced = env.RUMO_TUI_MODE;
  if (forced === 'static') return 'static';
  if (forced === 'interactive') return 'interactive';
  return process.stdout.isTTY && process.stdin.isTTY ? 'interactive' : 'static';
}

export function isInteractive(env: NodeJS.ProcessEnv = process.env): boolean {
  return resolveRunMode(env) === 'interactive';
}
