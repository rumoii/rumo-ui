/**
 * 测试入口(node --import tsx --test test/run-all.mjs)
 * 逐个 import 测试模块,node:test 收集执行 —— Windows 路径安全,顺序显式。
 */
import './log-stream.test.tsx';
import './terminal-prompt.test.tsx';
import './command-select.test.tsx';
import './catalog.test.ts';
import './static-runner.test.ts';
import './cli-non-tty.test.ts';
import './cli-interactive.test.tsx';
import './gates.test.ts';
