/**
 * TerminalPrompt §6.2 合同:onSubmit/history/prefix + ↑↓ 历史、Tab 补全
 * 证据层 L5(模块)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { render } from 'ink-testing-library';
import { TerminalPrompt } from '../src/components/TerminalPrompt.js';
import { settle } from './helpers/fake-stdio.js';

test('TerminalPrompt Enter 提交并清空草稿', async () => {
  const cmds: string[] = [];
  const inst = render(<TerminalPrompt onSubmit={(c) => cmds.push(c)} history={[]} prefix="> " />);
  await settle();
  inst.stdin.write('list');
  await settle();
  inst.stdin.write('\r');
  await settle();
  assert.deepEqual(cmds, ['list']);
  assert.ok(!(inst.lastFrame() ?? "").includes('list'), '提交后草稿清空');
  inst.unmount();
});

test('TerminalPrompt ↑↓ 翻历史且草稿保留', async () => {
  const cmds: string[] = [];
  const inst = render(<TerminalPrompt onSubmit={(c) => cmds.push(c)} history={['first', 'second']} />);
  await settle();
  inst.stdin.write('\u001B[A'); // ↑ → second
  await settle();
  assert.ok((inst.lastFrame() ?? "").includes('second'));
  inst.stdin.write('\u001B[A'); // ↑ → first
  await settle();
  assert.ok((inst.lastFrame() ?? "").includes('first'));
  inst.stdin.write('\u001B[B'); // ↓ → second
  await settle();
  assert.ok((inst.lastFrame() ?? "").includes('second'));
  inst.stdin.write('\u001B[B'); // ↓ → 回到草稿(空)
  await settle();
  assert.ok(!(inst.lastFrame() ?? "").includes('second'), '翻出历史后回到草稿');
  inst.unmount();
});

test('TerminalPrompt Tab 从 completions 补全', async () => {
  const inst = render(
    <TerminalPrompt onSubmit={() => {}} history={[]} completions={['export', 'print', 'back']} />
  );
  await settle();
  inst.stdin.write('ex');
  await settle();
  inst.stdin.write('\t');
  await settle();
  // 注意:ink 帧会裁行尾空格,断言不含尾空格
  assert.ok((inst.lastFrame() ?? "").includes('export'), 'Tab 补全到 export');
  inst.unmount();
});

test('TerminalPrompt 空命令不触发 onSubmit', async () => {
  const cmds: string[] = [];
  const inst = render(<TerminalPrompt onSubmit={(c) => cmds.push(c)} history={[]} />);
  await settle();
  inst.stdin.write('   \r');
  await settle();
  assert.deepEqual(cmds, [], '空白命令不提交');
  inst.unmount();
});
