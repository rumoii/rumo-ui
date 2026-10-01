/**
 * catalog + docs-extract:元数据合并与 :::demo 提取(镜像 md-loader 规则)
 * 证据层 L5(模块)+ 零维护来源锁定
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadCatalog, findCatalogItem, snippetFor } from '../src/catalog/index.js';
import { extractSnippet } from '../src/catalog/docs-extract.js';
import { repoRoot } from '../src/lib/repo-locate.js';

test('loadCatalog 合并 components.json 与 nav 分组,button 在列', () => {
  const cat = loadCatalog();
  assert.ok(cat.length > 50, `目录应含主要组件(实际 ${cat.length})`);
  const button = cat.find((it) => it.id === 'button');
  assert.ok(button, 'button 应在目录中');
  assert.equal(button.group, 'Basic');
  assert.ok(button.pkgPath.includes('packages/button'));
  assert.ok(button.hasDocs, 'button 文档存在');
});

test('snippetFor(button) 提取真实文档 demo(:::demo 后首个 html 围栏)', () => {
  const item = findCatalogItem('button');
  assert.ok(item);
  const snip = snippetFor(item);
  assert.equal(snip.source, 'docs');
  assert.ok(snip.code.includes('<'), 'demo 是 Vue/HTML 片段');
  assert.ok(!snip.code.includes(':::demo'), '不应带出容器标记');
});

test('缺文档时 extractSnippet 回退占位模板并明确标注', () => {
  const tmp = path.join(os.tmpdir(), `rumo-snippet-${Date.now()}`);
  fs.mkdirSync(tmp, { recursive: true });
  const snip = extractSnippet('no-such-comp', 'examples/docs/zh-CN/no-such-comp.md', tmp);
  assert.equal(snip.source, 'stub');
  assert.ok(snip.code.includes('占位模板'), 'stub 明确标注');
  assert.ok(snip.code.includes('rumo-no-such-comp'));
});

test('docs-extract 与 md-loader 同规则:首个 :::demo 内容优先', () => {
  const tmp = path.join(os.tmpdir(), `rumo-snippet2-${Date.now()}`);
  fs.mkdirSync(path.join(tmp, 'examples/docs/zh-CN'), { recursive: true });
  const md = '## X\n\n:::demo 说明\n\n```html\n<first-demo />\n```\n:::\n\n:::demo 二\n\n```html\n<second-demo />\n```\n:::\n';
  fs.writeFileSync(path.join(tmp, 'examples/docs/zh-CN/x.md'), md, 'utf8');
  const snip = extractSnippet('x', 'examples/docs/zh-CN/x.md', tmp);
  assert.equal(snip.source, 'docs');
  assert.ok(snip.code.includes('<first-demo />'));
  assert.ok(!snip.code.includes('<second-demo />'), '只取首个 demo(md-loader 行为)');
});

test('docs-extract CRLF + 空行形态可提取(真实文档均为 CRLF)', () => {
  const tmp = path.join(os.tmpdir(), `rumo-snippet3-${Date.now()}`);
  fs.mkdirSync(path.join(tmp, 'examples/docs/zh-CN'), { recursive: true });
  const md = '## X\r\n\r\n:::demo 说明\r\n\r\n```html\r\n<crlf-demo />\r\n```\r\n:::\r\n';
  fs.writeFileSync(path.join(tmp, 'examples/docs/zh-CN/x.md'), md, 'utf8');
  const snip = extractSnippet('x', 'examples/docs/zh-CN/x.md', tmp);
  assert.equal(snip.source, 'docs', 'CRLF+空行不得误判为无 demo');
  assert.ok(snip.code.includes('<crlf-demo />'));
});

test('真实文档提取抽查:曾误判的 8 件均应为 docs 来源', () => {
  const root = repoRoot();
  for (const id of ['backtop', 'badge', 'breadcrumb', 'drawer', 'message-box', 'progress', 'rate', 'switch']) {
    const item = findCatalogItem(id);
    assert.ok(item, `${id} 应在目录中`);
    const snip = snippetFor(item, root);
    assert.equal(snip.source, 'docs', `${id} 应提取到真实 demo,而非占位`);
  }
});

test('目录 id 归一匹配:date-picker 连字符/驼峰均可命中', () => {
  const dp = findCatalogItem('DatePicker') ?? findCatalogItem('datepicker') ?? findCatalogItem('date-picker');
  assert.ok(dp, 'DatePicker 各种写法都应命中');
  assert.equal(dp.id, 'date-picker');
  const inf = findCatalogItem('InfiniteScroll') ?? findCatalogItem('infinite-scroll');
  assert.ok(inf, 'InfiniteScroll 应命中(文档文件是驼峰 infiniteScroll.md)');
  assert.ok(inf.hasDocs, '驼峰文档文件名应被识别');
});

test('repoRoot 从模块位置定位仓库根(不依赖 cwd)', () => {
  const root = repoRoot();
  assert.ok(fs.existsSync(path.join(root, 'tokens', 'tokens.json')));
  assert.ok(fs.existsSync(path.join(root, 'components.json')));
});
