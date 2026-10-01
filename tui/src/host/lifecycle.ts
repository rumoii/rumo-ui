/**
 * CLI 会话生命周期 —— 六步拆除,镜像 web 端 packages/terminal/src/main.vue `_destroy` 纪律
 *
 * 状态机(created → starting → running → tearing-down → exited / failed):
 *   - 权威状态:本模块的 session 状态;派生状态(ink 画面/光标)只可由其收敛;
 *   - 拆除幂等:teardown() 可重复调用,第二次起 no-op;
 *   - 失败保全:任一步清理抛错不吞主错误,记录后继续后续步(rumo-lifecycle-safety)。
 *
 * 资源清单与释放顺序(依赖序):
 *   1. 定时器(LogStream follow 等)—— 2. 按键流监听 —— 3. stdin raw mode/流控制
 *   4. ink 渲染根 unmount —— 5. 光标/样式复位 —— 6. 定退出码并退出
 */

export type SessionState = 'created' | 'starting' | 'running' | 'tearing-down' | 'exited' | 'failed';

export interface TeardownStep {
  name: string;
  run: () => void;
}

export class CliSession {
  private state: SessionState = 'created';
  private steps: TeardownStep[] = [];
  private timers: Set<NodeJS.Timeout> = new Set();
  private stdinRestore: (() => void) | null = null;
  private teardownErrors: string[] = [];
  private exitCode = 0;

  getState(): SessionState {
    return this.state;
  }

  /** starting → running(入口显式推进,拒绝非法跃迁) */
  markRunning(): void {
    if (this.state !== 'created' && this.state !== 'starting') {
      throw new Error(`[lifecycle] 非法跃迁 ${this.state} -> running`);
    }
    this.state = 'running';
  }

  markFailed(): void {
    this.state = 'failed';
    this.exitCode = 1;
  }

  /** 计入受管定时器,teardown 第 1 步统一清 */
  trackTimer(t: NodeJS.Timeout): NodeJS.Timeout {
    this.timers.add(t);
    return t;
  }

  clearTrackedTimers(): void {
    for (const t of this.timers) {
      try {
        clearTimeout(t);
        clearInterval(t as unknown as NodeJS.Timeout);
      } catch {
        /* 清理失败不覆盖主流程 */
      }
    }
    this.timers.clear();
  }

  /** 注册 stdin raw mode 还原钩子(teardown 第 3 步) */
  registerStdinRestore(fn: () => void): void {
    this.stdinRestore = fn;
  }

  /** 注册第 2/4/5 步自定义清理(按键流失效、ink unmount、光标复位) */
  addTeardownStep(step: TeardownStep): void {
    this.steps.push(step);
  }

  /**
   * 六步拆除。幂等;单步失败记录到 teardownErrors 不中断后续步。
   * 返回进程退出码(失败拆除提升为 1)。
   */
  teardown(): number {
    if (this.state === 'exited' || this.state === 'tearing-down') {
      return this.exitCode;
    }
    this.state = 'tearing-down';

    // 1. 清定时器
    this.clearTrackedTimers();

    // 2/4/5. 自定义步骤(按键流失效、ink unmount、光标复位),按注册序
    for (const step of this.steps) {
      try {
        step.run();
      } catch (e) {
        this.teardownErrors.push(`${step.name}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 3. stdin 还原(raw mode off + pause)
    if (this.stdinRestore) {
      try {
        this.stdinRestore();
      } catch (e) {
        this.teardownErrors.push(`stdin-restore: ${e instanceof Error ? e.message : String(e)}`);
      }
      this.stdinRestore = null;
    }

    if (this.teardownErrors.length > 0) {
      for (const msg of this.teardownErrors) {
        process.stderr.write(`[rumo-tui] 清理告警: ${msg}\n`);
      }
      this.exitCode = this.exitCode === 0 ? 1 : this.exitCode;
    }

    this.state = 'exited';
    return this.exitCode;
  }

  setExitCode(code: number): void {
    this.exitCode = code;
  }
}
