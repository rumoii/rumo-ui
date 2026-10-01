/**
 * check-gates.mjs 自测:每个不变量注入违例必须失败(fail-closed 证明)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GATES } from '../scripts/check-gates.mjs';

function gate(id: string) {
  const g = GATES.find((x) => x.id === id);
  if (!g) throw new Error(`gate ${id} missing`);
  return g;
}

test('G1 违例:build 引用 tui → fail', () => {
  const r = gate('G1').check({ buildFiles: { 'webpack.common.js': "entry: 'tui/src/index.ts'" }, componentsKeys: ['button'], baselineKeys: ['button'] });
  assert.ok(!r.ok, 'G1 应拒绝 build 引用 tui');
});

test('G1 违例:components.json 键集漂移 → fail', () => {
  const r = gate('G1').check({ buildFiles: {}, componentsKeys: ['button'], baselineKeys: ['button', 'alert'] });
  assert.ok(!r.ok, 'G1 应拒绝 components.json 键集漂移');
});

test('G2 违例:files 含 tui → fail', () => {
  const r = gate('G2').check({ packageFilesField: ['lib', 'tui'], buildFiles: {}, componentsKeys: [], baselineKeys: [] });
  assert.ok(!r.ok, 'G2 应拒绝发布面包含 tui');
});

test('G3 违例:业务源码硬编码共享 hex → fail', () => {
  const r = gate('G3').check({
    srcFiles: { 'src/views/app.tsx': 'const c = "#856AF9";' },
    buildFiles: {},
    componentsKeys: [],
    baselineKeys: [],
    packageFilesField: []
  });
  assert.ok(!r.ok, 'G3 应拒绝硬编码共享色');
});

test('G3 放行:tokens 生成物自身含 hex', () => {
  const r = gate('G3').check({
    srcFiles: { 'src/tokens/index.ts': 'export const tokens = {"hex":"#856AF9"}' },
    buildFiles: {},
    componentsKeys: [],
    baselineKeys: [],
    packageFilesField: []
  });
  assert.ok(r.ok, 'tokens/index.ts 是生成物,允许含 hex');
});
