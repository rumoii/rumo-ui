/**
 * 交互渲染宿主 —— 全仓仅 primitives/ink/ 与本文件可 import 'ink'
 *
 * 职责:ink render 包装 + stdin raw mode 所有权登记进 CliSession + 退出收敛到六步拆除。
 */
import { render } from 'ink';
import type { ReactElement } from 'react';
import type { CliSession } from './lifecycle.js';

export interface RenderRootOptions {
  session: CliSession;
  /** 测试注入用;默认 process.stdin/stdout */
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}

export interface RenderRoot {
  waitUntilExit: () => Promise<void>;
  unmount: () => void;
}

export function renderRoot(element: ReactElement, opts: RenderRootOptions): RenderRoot {
  const { session } = opts;
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;

  // stdin raw mode 所有权:进入时置 raw,拆除第 3 步还原
  let rawModeWasOn = false;
  if (typeof (stdin as { setRawMode?: (v: boolean) => void }).setRawMode === 'function') {
    rawModeWasOn = Boolean(stdin.isRaw);
    (stdin as { setRawMode: (v: boolean) => void }).setRawMode(true);
    session.registerStdinRestore(() => {
      const s = stdin as { setRawMode?: (v: boolean) => void; pause: () => void };
      if (typeof s.setRawMode === 'function' && !rawModeWasOn) {
        s.setRawMode(false);
      }
      s.pause();
    });
  }

  const instance = render(element, { stdin: stdin as never, stdout: stdout as never, exitOnCtrlC: false });

  // 第 4 步:ink 渲染根 unmount(拆除顺序中位于按键流失效之后、光标复位之前)
  session.addTeardownStep({
    name: 'ink-unmount',
    run: () => {
      instance.unmount();
    }
  });

  // 第 5 步:光标/样式复位,防止隐藏光标泄漏到用户 shell
  session.addTeardownStep({
    name: 'cursor-reset',
    run: () => {
      stdout.write('\x1b[?25h\x1b[0m');
    }
  });

  return {
    waitUntilExit: async () => {
      await instance.waitUntilExit();
    },
    unmount: () => instance.unmount()
  };
}
