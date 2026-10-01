/**
 * LogStream §6.2 合同:lines/height/follow/filter + f 切跟随、c 清屏
 * 证据层 L5(模块):不证明真机字形/色彩/闪烁
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { render } from 'ink-testing-library';
import { LogStream } from '../src/components/LogStream.js';
import { settle } from './helpers/fake-stdio.js';

test('LogStream 渲染行并按 filter 过滤', async () => {
  const lines = ['alpha one', 'beta two', 'alpha three'];
  const { lastFrame, unmount } = render(<LogStream lines={lines} height={10} follow filter="alpha" />);
  await settle();
  const frame = lastFrame() ?? "";
  assert.ok(frame.includes('alpha one'));
  assert.ok(frame.includes('alpha three'));
  assert.ok(!frame.includes('beta two'), 'filter 应滤掉不匹配行');
  unmount();
});

test('LogStream follow 窗口取尾部', async () => {
  const lines = Array.from({ length: 30 }, (_, i) => `line-${i}`);
  const { lastFrame, unmount } = render(<LogStream lines={lines} height={5} follow />);
  await settle();
  const frame = lastFrame() ?? "";
  assert.ok(frame.includes('line-29'), '跟随态显示尾行');
  assert.ok(!frame.includes('line-0'), '跟随态不显示首行');
  unmount();
});

test('LogStream c 键清屏隐藏已显示行', async () => {
  const lines = ['keep-free-1', 'keep-free-2'];
  const inst = render(<LogStream lines={lines} height={10} follow />);
  await settle();
  assert.ok((inst.lastFrame() ?? "").includes('keep-free-1'));
  inst.stdin.write('c');
  await settle();
  const after = inst.lastFrame() ?? "";
  assert.ok(!after.includes('keep-free-1'), '清屏后旧行隐藏');
  assert.ok(after.includes('空') || after.includes('行'), '清屏后仍有状态栏');
  inst.unmount();
});

test('LogStream f 键切换跟随且通知宿主', async () => {
  const seen: boolean[] = [];
  const inst = render(<LogStream lines={['x']} height={3} follow onFollowChange={(v) => seen.push(v)} />);
  await settle();
  inst.stdin.write('f');
  await settle();
  assert.deepEqual(seen, [false]);
  inst.stdin.write('f');
  await settle();
  assert.deepEqual(seen, [false, true]);
  inst.unmount();
});

test('LogStream active=false 不响应按键', async () => {
  const seen: boolean[] = [];
  const inst = render(<LogStream lines={['x']} height={3} follow active={false} onFollowChange={(v) => seen.push(v)} />);
  await settle();
  inst.stdin.write('f');
  inst.stdin.write('c');
  await settle();
  assert.deepEqual(seen, [], '非 active 实例不吃按键');
  inst.unmount();
});
