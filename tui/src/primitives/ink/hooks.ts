/**
 * ink hooks 适配:把 ink 的按键事件转成中立 KeyInput
 *
 * 仅 primitives/ink/ 允许 import 'ink';业务组件只用 useKeyInput / useExit。
 */
import { useInput as inkUseInput, useApp } from 'ink';
import type { KeyHandler } from '../types.js';

export function useKeyInput(handler: KeyHandler): void {
  inkUseInput((input, key) => {
    handler({
      input,
      upArrow: key.upArrow,
      downArrow: key.downArrow,
      return: key.return,
      escape: key.escape,
      tab: key.tab,
      backspace: key.backspace,
      ctrl: key.ctrl
    });
  });
}

export function useExit(): { exit: (error?: Error) => void } {
  const { exit } = useApp();
  return { exit };
}
