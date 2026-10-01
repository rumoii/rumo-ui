/**
 * 测试用假 stdio —— ink-testing-library 自带 stdin,本模块补:
 * - setRawMode 调用记录(断言拆除第 3 步把 raw mode 还原为 false)
 * - 假 TTY stdout(columns/rows 可控)供需要 stdout 属性的组件
 */
import { EventEmitter } from 'node:events';

export class FakeStdin extends EventEmitter {
  isTTY = true;
  isRaw = false;
  setRawModeCalls: boolean[] = [];
  private pending: string | null = null;

  setRawMode = (v: boolean): this => {
    this.isRaw = v;
    this.setRawModeCalls.push(v);
    return this;
  };

  pause = (): this => this;
  resume = (): this => this;
  ref = (): this => this;
  unref = (): this => this;
  setEncoding = (): this => this;

  // ink 7 走 'readable' + read() 流接口(ink-testing-library 同形)
  read = (): string | null => {
    const d = this.pending;
    this.pending = null;
    return d;
  };

  write = (data: string): boolean => {
    this.pending = data;
    this.emit('readable');
    this.emit('data', data);
    return true;
  };
}

export class FakeStdout extends EventEmitter {
  isTTY = true;
  columns = 120;
  rows = 40;
  chunks: string[] = [];

  write = (data: string): boolean => {
    this.chunks.push(data);
    return true;
  };

  get output(): string {
    return this.chunks.join('');
  }
}

/** 检查 setRawMode 调用序列末位是否为 false(拆除还原) */
export function rawModeRestored(stdin: FakeStdin): boolean {
  return stdin.setRawModeCalls.length > 0 && stdin.setRawModeCalls[stdin.setRawModeCalls.length - 1] === false;
}

/**
 * 等一拍让 React 落帧(stdin.write 触发的 setState 重渲染是异步的,
 * 同步读 lastFrame 会拿到旧帧)。
 */
export async function settle(ms = 30): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
