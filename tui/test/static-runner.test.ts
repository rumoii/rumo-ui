/**
 * static-runner + parseArgs:CLI 参数面冻结(§ interface-evolution)
 * 退出码合同:0 成功 / 2 参数错 / 1 运行失败
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs, runStatic } from '../src/host/static-runner.js';

test('parseArgs --list 可带查询词', () => {
  assert.deepEqual(parseArgs(['--list']), { command: 'list', query: '', json: false });
  assert.deepEqual(parseArgs(['--list', 'but']), { command: 'list', query: 'but', json: false });
});

test('parseArgs --snippet/--export 需要组件名,缺名报错', () => {
  assert.deepEqual(parseArgs(['--snippet', 'button']), { command: 'snippet', name: 'button', json: false });
  assert.deepEqual(parseArgs(['--export', 'button', 'out.vue']), {
    command: 'export',
    name: 'button',
    file: 'out.vue',
    json: false
  });
  assert.ok('error' in parseArgs(['--snippet']), '缺名参数错');
  assert.ok('error' in parseArgs(['--export']), '缺名参数错');
});

test('parseArgs --json 组合生效', () => {
  assert.deepEqual(parseArgs(['--list', '--json']), { command: 'list', query: '', json: true });
});

test('parseArgs 未知参数报错(退出码 2 的依据)', () => {
  const r = parseArgs(['--nope']);
  assert.ok('error' in r);
});

test('parseArgs 无参数 → help', () => {
  assert.deepEqual(parseArgs([]), { command: 'help', json: false });
});

test('parseArgs help/version 与命令互斥(对称守卫)', () => {
  assert.ok('error' in parseArgs(['--list', 'x', '--help']), '--list 后接 --help 应报错');
  assert.ok('error' in parseArgs(['--help', '--list', 'x']), '--help 后接 --list 应报错');
});

test('runStatic --export 落盘真实片段', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rumo-static-export-'));
  const target = path.join(tmp, 'out.vue');
  const code = runStatic(['--export', 'button', target]);
  assert.equal(code, 0);
  const written = fs.readFileSync(target, 'utf8');
  assert.ok(written.includes('rumo-'), '导出内容应含真实组件标签');
  assert.ok(!written.includes('占位模板'), 'button 有文档,不应是占位模板');
});

test('runStatic --snippet 未知组件 → exit 1', () => {
  assert.equal(runStatic(['--snippet', 'no-such-comp-xyz']), 1);
});
