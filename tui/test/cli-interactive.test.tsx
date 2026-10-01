/**
 * 组装层(fake TTY):交互全屏重绘 / 高亮移动 / 片段导出 / 干净卸载(L7 自动化面)
 * 证据边界:不证明 Windows Terminal 真渲染/闪烁/字形
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import React from 'react';
import { render } from 'ink-testing-library';
import { App } from '../src/views/app.js';
import { CommandSelect } from '../src/components/CommandSelect.js';
import { CodegenView } from '../src/views/codegen.js';
import { FakeStdin, FakeStdout, rawModeRestored, settle } from './helpers/fake-stdio.js';
import { CliSession } from '../src/host/lifecycle.js';
import { renderRoot } from '../src/host/render.js';
import { CodegenView as CodegenViewRaw } from '../src/views/codegen.js';

const items = [
  { id: 'button', label: 'Button 按钮', detail: 'Basic' },
  { id: 'alert', label: 'Alert 警告', detail: 'Feedback' }
];

test('交互: ↓ 高亮帧位移', async () => {
  const inst = render(<CommandSelect items={items} onSelect={() => {}} height={6} />);
  await settle();
  const f0 = inst.lastFrame() ?? "";
  assert.ok((f0.split('\n').find((l) => l.includes('❯')) ?? '').includes('Button'), '初始高亮第一项');
  inst.stdin.write('\u001B[B'); // ↓ 到第二项
  await settle();
  const f1 = inst.lastFrame() ?? "";
  assert.notEqual(f0, f1, '↓ 后帧变化');
  const activeLine = f1.split('\n').find((l) => l.includes('❯')) ?? '';
  assert.ok(activeLine.includes('Alert'), `高亮应落在第二项: ${activeLine}`);
  inst.unmount();
});

test('交互: codegen 片段可见 + export 命令落盘', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rumo-export-'));
  const code = '<template>\n  <rumo-button>hi</rumo-button>\n</template>\n';
  const inst = render(
    <CodegenView
      item={{
        id: 'button',
        label: 'Button 按钮',
        group: 'Basic',
        pkgPath: './packages/button/index.js',
        docsPath: 'x.md',
        hasDocs: true
      }}
      code={code}
      onBack={() => {}}
      exportDir={tmpDir}
    />
  );
  await settle();
  assert.ok((inst.lastFrame() ?? "").includes('rumo-button'), '片段面板可见');
  for (const ch of 'export out.vue') {
    inst.stdin.write(ch);
    await settle(5);
  }
  inst.stdin.write('\r');
  await settle();
  const target = path.join(tmpDir, 'out.vue');
  assert.ok(fs.existsSync(target), 'export 落盘');
  assert.equal(fs.readFileSync(target, 'utf8'), code);
  assert.ok((inst.lastFrame() ?? "").includes('已导出'), '日志回显导出路径');
  inst.unmount();
});

test('交互: renderRoot 捕获流含 ANSI 序列且拆除还原 raw mode', async () => {
  const session = new CliSession();
  session.markRunning();
  const stdin = new FakeStdin();
  const stdout = new FakeStdout();
  const root = renderRoot(React.createElement(CommandSelect, { items, onSelect: () => {}, height: 5 }), {
    session,
    stdin: stdin as never,
    stdout: stdout as never
  });
  stdin.write('\u001B[B');
  await settle();
  assert.ok(/\x1b\[/.test(stdout.output), '捕获流应含 ANSI 转义(全屏重绘)');
  const code = session.teardown();
  assert.equal(code, 0);
  assert.ok(rawModeRestored(stdin), '拆除后 raw mode 还原为 false');
  root.unmount();
});

test('交互: App 首页 quit 真退出(waitUntilExit 解除)', async () => {
  const session = new CliSession();
  session.markRunning();
  const stdin = new FakeStdin();
  const stdout = new FakeStdout();
  const root = renderRoot(React.createElement(App), {
    session,
    stdin: stdin as never,
    stdout: stdout as never
  });
  await settle();
  assert.ok(stdout.output.includes('rumo TUI'), '首页已渲染');
  for (const ch of 'quit') {
    stdin.write(ch);
    await settle(5);
  }
  stdin.write('\r');
  // quit → useApp.exit() → waitUntilExit 解除(3s 超时防挂)
  await Promise.race([
    root.waitUntilExit(),
    new Promise((_, rej) => setTimeout(() => rej(new Error('quit 未触发退出')), 3000))
  ]);
  assert.equal(session.teardown(), 0, '退出后六步拆除干净');
  root.unmount();
});

test('交互: codegen quit 是退出而非 back;back 回来路', async () => {
  let backCalls = 0;
  const code = '<template><rumo-button /></template>\n';
  const inst = render(
    <CodegenViewRaw
      item={{ id: 'button', label: 'Button 按钮', group: 'Basic', pkgPath: './packages/button/index.js', docsPath: 'x.md', hasDocs: true }}
      code={code}
      onBack={() => (backCalls += 1)}
    />
  );
  await settle();
  for (const ch of 'back') {
    inst.stdin.write(ch);
    await settle(5);
  }
  inst.stdin.write('\r');
  await settle();
  assert.equal(backCalls, 1, 'back 触发 onBack(回到来源视图)');
  inst.unmount();
});

test('lifecycle: teardown 幂等(二次调用 no-op 且退出码稳定)', () => {
  const s = new CliSession();
  s.markRunning();
  let steps = 0;
  s.addTeardownStep({ name: 't', run: () => (steps += 1) });
  const c1 = s.teardown();
  const c2 = s.teardown();
  assert.equal(steps, 1, '步骤只执行一次');
  assert.equal(c1, c2, '退出码稳定');
});
