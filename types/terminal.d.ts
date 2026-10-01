import { RumoUIComponent } from './component';
import { Terminal as XTerminal, ITerminalOptions } from 'xterm';

export interface TerminalResizePayload {
  cols: number;
  rows: number;
}

/** Terminal Component */
export declare class RumoTerminal extends RumoUIComponent {
  /** 透传 xterm 原生 ITerminalOptions 配置 */
  options: ITerminalOptions;

  /** 终端行数 */
  rows: number;

  /** 终端列数 */
  cols: number;

  /** 只读模式 */
  readOnly: boolean;

  /** 自动适配容器尺寸 */
  autoFit: boolean;

  /** 向终端写入数据 */
  write(data: string | Uint8Array): void;

  /** 向终端写入一行数据（自动追加换行） */
  writeln(data: string): void;

  /** 清空终端内容 */
  clear(): void;

  /** 手动适配容器尺寸 */
  fit(): void;

  /** 聚焦终端 */
  focus(): void;

  /** 失去焦点 */
  blur(): void;

  /** 获取底层 xterm 实例 */
  getTerminal(): XTerminal | null;
}
