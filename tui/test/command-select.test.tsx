/**
 * CommandSelect §6.2 合同:items{id,label,detail}/onSelect + 模糊过滤、↑↓、Enter/ESC
 * 证据层 L5(模块)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { render } from 'ink-testing-library';
import { CommandSelect } from '../src/components/CommandSelect.js';
import { settle } from './helpers/fake-stdio.js';

const items = [
  { id: 'button', label: 'Button 按钮', detail: 'Basic' },
  { id: 'alert', label: 'Alert 警告', detail: 'Feedback' },
  { id: 'table', label: 'Table 表格', detail: 'Data' }
];

test('CommandSelect 输入过滤(模糊)', async () => {
  const inst = render(<CommandSelect items={items} onSelect={() => {}} />);
  await settle();
  inst.stdin.write('btn');
  await settle();
  const frame = inst.lastFrame() ?? "";
  assert.ok(frame.includes('Button'), '模糊命中 Button');
  assert.ok(!frame.includes('Alert'), '过滤掉非命中项');
  assert.ok(!frame.includes('Table'), '过滤掉非命中项');
  inst.unmount();
});

test('CommandSelect ↑↓ 移动高亮', async () => {
  const inst = render(<CommandSelect items={items} onSelect={() => {}} />);
  await settle();
  const f0 = inst.lastFrame() ?? "";
  assert.ok(f0.includes('❯'), '默认有高亮');
  inst.stdin.write('\u001B[B'); // ↓
  await settle();
  const f1 = inst.lastFrame() ?? "";
  assert.notEqual(f0, f1, '↓ 后帧变化(高亮移动)');
  inst.unmount();
});

test('CommandSelect Enter 选中过滤后首项', async () => {
  const picked: Array<{ id: string }> = [];
  const inst = render(<CommandSelect items={items} onSelect={(it) => picked.push(it)} />);
  await settle();
  inst.stdin.write('tab');
  await settle();
  inst.stdin.write('\r');
  await settle();
  assert.equal(picked.length, 1);
  assert.equal(picked[0].id, 'table', '过滤后 Enter 选中命中的 table');
  inst.unmount();
});

test('CommandSelect ESC 触发 onExit', async () => {
  let exited = false;
  const inst = render(<CommandSelect items={items} onSelect={() => {}} onExit={() => (exited = true)} />);
  await settle();
  inst.stdin.write('\u001B');
  await settle();
  assert.ok(exited, 'ESC 退出');
  inst.unmount();
});

test('CommandSelect 无匹配时显示空态', async () => {
  const inst = render(<CommandSelect items={items} onSelect={() => {}} />);
  await settle();
  inst.stdin.write('zzzzz');
  await settle();
  assert.ok((inst.lastFrame() ?? "").includes('无匹配项'), '空态提示');
  inst.unmount();
});
