'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { generate } = require('./gen-api');

const manifest = generate();
const entry = id => manifest.components.find(component => component.id === id);

test('heading aliases, option tables and method notation resolve without ambiguity', () => {
  assert.ok(entry('dropdown-item').props.find(prop => prop.name === 'command').docs.length);
  assert.ok(entry('menu-item-group').props.find(prop => prop.name === 'title').docs.length);
  assert.ok(entry('date-picker').docs.options.some(row => row.name === 'shortcuts'));
  assert.ok(entry('animate').methods.some(method => method.name === 'play'));
  for (const name of ['clear', 'undo', 'save']) assert.ok(entry('signature').methods.some(method => method.name === name));
  assert.deepEqual(manifest.components.flatMap(component => component.mismatches.filter(item => item.kind.startsWith('ambiguous'))), []);
});

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rumo-api-root-'));
  const write = (file, content) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, typeof content === 'string' ? content : JSON.stringify(content));
  };
  write('components.json', { button: './packages/button/index.js' });
  write('package.json', { dependencies: {} });
  write('src/index.js', "import Button from '../packages/button/index.js'; export default { Button };");
  write('packages/button/index.js', "export default { name: 'RumoButton', props: { text: Boolean, openDelay: Number } };");
  write('examples/docs/zh-CN/button.md', '## Button\n### Attributes\n| 参数 | 说明 |\n| --- | --- |\n| text | 文字 |\n| maxlength | 透传 |\n### Mystery Attributes\n| 参数 | 说明 |\n| --- | --- |\n| unknown | 未知 |\n### 组件属性与方法\n| 参数 | 说明 |\n| --- | --- |\n| missing() | 未知方法 |\n');
  const run = args => spawnSync(process.execPath, [path.join(__dirname, 'gen-api.js'), '--root', root, ...args], { encoding: 'utf8', cwd: os.tmpdir() });
  const read = () => JSON.parse(fs.readFileSync(path.join(root, 'components.api.json'), 'utf8'));
  const exceptions = [
    { kind: 'source-only', group: 'props', name: 'openDelay', reason: '内部属性' },
    { kind: 'docs-only', group: 'props', name: 'maxlength', reason: '原生透传' },
    { kind: 'ambiguous-doc-section', section: 'Mystery Attributes', reason: '非组件表格' },
    { kind: 'ambiguous-doc-row', section: '组件属性与方法', name: 'missing()', reason: '非公开方法' }
  ];
  return { root, write, run, read, exceptions };
}

test('--root generates and checks the target repository without changing the script repository', () => {
  const f = fixture();
  const ownTarget = path.resolve(__dirname, '../components.api.json');
  const before = fs.readFileSync(ownTarget, 'utf8');
  assert.equal(f.run([]).status, 0);
  assert.ok(fs.existsSync(path.join(f.root, 'components.api.json')));
  assert.equal(f.read().components.length, 1);
  assert.equal(f.read().components[0].files.source, 'packages/button/index.js');
  const generated = fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8');
  assert.equal(f.run([]).status, 0);
  assert.equal(fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8'), generated);
  assert.equal(f.run(['--check']).status, 0);
  f.write('packages/button/index.js', "export default { name: 'RumoButton', props: { extra: Boolean } };");
  assert.match(f.run(['--check']).stderr, /API manifest differs: button/);
  assert.equal(fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8'), generated);
  assert.equal(fs.readFileSync(ownTarget, 'utf8'), before);
});

test('exceptions move exact mismatches to acknowledged with reasons and stable ordering', () => {
  const f = fixture();
  f.write('scripts/api-exceptions/button.json', f.exceptions);
  assert.equal(f.run(['--strict']).status, 0);
  const component = f.read().components[0];
  assert.deepEqual(component.mismatches, []);
  assert.equal(component.acknowledged.length, 4);
  for (const exception of f.exceptions) {
    const match = component.acknowledged.find(item => item.kind === exception.kind);
    for (const field of Object.keys(exception)) assert.equal(match[field], exception[field]);
    assert.ok(match.file);
  }
  f.write('scripts/api-exceptions/button.json', f.exceptions.slice().reverse());
  assert.equal(f.run(['--check', '--strict']).status, 0);
  assert.deepEqual(generate(f.root), f.read());
  assert.equal(generate().components.length, manifest.components.length, 'programmatic roots do not leak state');
});

test('exceptions do not hide other groups, sections or names', () => {
  const f = fixture();
  f.write('packages/button/index.js', "export default { name: 'RumoButton', props: { text: Boolean, openDelay: Number }, methods: { fire() { this.$emit('openDelay'); } } };");
  const docs = fs.readFileSync(path.join(f.root, 'examples/docs/zh-CN/button.md'), 'utf8');
  f.write('examples/docs/zh-CN/button.md', docs + '| other() | 未知方法 |\n### 方法与事件\n| 名称 | 说明 |\n| --- | --- |\n| missing() | 另一节 |\n### Other Attributes\n| 参数 | 说明 |\n| --- | --- |\n| unknown | 另一表 |\n');
  f.write('scripts/api-exceptions/button.json', f.exceptions);
  assert.equal(f.run(['--strict']).status, 1);
  const component = f.read().components[0];
  assert.equal(component.acknowledged.length, 4);
  assert.equal(component.mismatches.length, 4);
  assert.ok(component.mismatches.some(item => item.group === 'events' && item.name === 'openDelay'));
  assert.ok(component.mismatches.some(item => item.section === '方法与事件' && item.name === 'missing()'));
  assert.ok(component.mismatches.some(item => item.section === '组件属性与方法' && item.name === 'other()'));
  assert.ok(component.mismatches.some(item => item.section === 'Other Attributes'));
});

test('--strict reports unresolved entries, combines with --check and passes resolved manifests', () => {
  const f = fixture();
  const failure = f.run(['--strict']);
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /button/);
  assert.match(failure.stderr, /source-only.*props.*openDelay/);
  assert.equal(f.run(['--check']).status, 0);
  const before = fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8');
  assert.equal(f.run(['--strict', '--check']).status, 1);
  assert.equal(fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8'), before);
  f.write('examples/docs/zh-CN/button.md', '## Button\n### Attributes\n| 参数 | 说明 |\n| --- | --- |\n| text | 文字 |\n| open-delay | 延时 |\n');
  assert.equal(f.run(['--strict']).status, 0);
  assert.equal(f.run(['--check', '--strict']).status, 0);
  assert.deepEqual(f.read().components[0].acknowledged, []);
});

test('--check rejects stale exceptions even when the generated manifest is current', () => {
  const f = fixture();
  f.write('scripts/api-exceptions/button.json', f.exceptions.concat({ kind: 'source-only', group: 'props', name: 'gone', reason: '已删除属性' }));
  assert.equal(f.run([]).status, 0);
  const before = fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8');
  const failure = f.run(['--check', '--strict']);
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /Stale API exception.*scripts[\/]api-exceptions[\/]button.json.*gone/);
  assert.equal(fs.readFileSync(path.join(f.root, 'components.api.json'), 'utf8'), before);
  f.write('scripts/api-exceptions/button.json', f.exceptions.slice(0, 3).concat({ kind: 'source-only', group: 'props', name: 'gone', reason: '已删除属性' }));
  assert.equal(f.run([]).status, 0);
  const combined = f.run(['--check', '--strict']);
  assert.equal(combined.status, 1);
  assert.match(combined.stderr, /Stale API exception/);
  assert.match(combined.stderr, /Unresolved API mismatches: 1 components, 1 entries/);
  assert.match(combined.stderr, /button:.*ambiguous-doc-row.*missing/);
});

test('invalid exception files fail with the filename before writing output', () => {
  const f = fixture();
  const valid = f.exceptions[0];
  const invalid = [
    '{broken', {}, [null], [Object.assign({}, valid, { reason: '' })],
    [Object.assign({}, valid, { reason: '  ' })], [Object.assign({}, valid, { reason: 1 })],
    [{ kind: 'source-only', group: 'props', name: 'openDelay' }],
    [Object.assign({}, valid, { kind: 'unknown' })], [Object.assign({}, valid, { group: 'unknown' })],
    [Object.assign({}, valid, { name: '' })], [Object.assign({}, valid, { section: 'Attributes' })],
    [Object.assign({}, valid, { typo: true })], [valid, valid],
    [{ kind: 'ambiguous-doc-section', reason: 'missing section' }],
    [{ kind: 'ambiguous-doc-row', section: 'Table', reason: 'missing name' }]
  ];
  for (const value of invalid) {
    f.write('scripts/api-exceptions/button.json', value);
    const failure = f.run([]);
    assert.equal(failure.status, 1, JSON.stringify(value));
    assert.match(failure.stderr, /Invalid API exceptions.*scripts[\/]api-exceptions[\/]button.json/);
    assert.equal(fs.existsSync(path.join(f.root, 'components.api.json')), false);
  }
});

test('--root requires a directory argument', () => {
  const failure = spawnSync(process.execPath, [path.join(__dirname, 'gen-api.js'), '--root', '--check'], { encoding: 'utf8' });
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /--root requires a directory/);
});

test('props follow imported mixins, Vue names, exports and model definitions', () => {
  assert.equal(entry('button').tag, 'rumo-button');
  for (const name of ['text', 'dashed', 'variant']) assert.ok(entry('button').props.some(prop => prop.name === name));
  assert.deepEqual(entry('command-palette').model, { prop: 'visible', event: 'update:visible' });
  const inherited = entry('date-picker').props.find(prop => prop.name === 'appendToBody');
  assert.deepEqual(inherited.type, ['Boolean']);
  assert.equal(inherited.default, true);
  assert.equal(inherited.source, 'packages/date-picker/src/picker.vue');
  assert.equal(entry('message').kind, 'service');
  assert.equal(entry('message').tag, null);
  assert.equal(entry('infinite-scroll').kind, 'directive');
});

test('multi-component docs and singular Attribute tables attach to the correct component', () => {
  assert.equal(entry('breadcrumb-item').files.docs, 'examples/docs/zh-CN/breadcrumb.md');
  assert.ok(entry('breadcrumb-item').props.find(prop => prop.name === 'to').docs.length);
  assert.equal(entry('breadcrumb').docs.props.some(prop => prop.name === 'to'), false);
  assert.ok(entry('upload').props.find(prop => prop.name === 'action').docs.length);
  assert.ok(entry('form').methods.some(method => method.name === 'validate'));
  assert.equal(entry('table').docs.props.some(prop => prop.name === 'sortable'), false);
  assert.ok(entry('table-column').props.find(prop => prop.name === 'sortable').docs.length);
  assert.ok(entry('calendar').props.find(prop => prop.name === 'range').docs.length);
  assert.ok(entry('check-tag').events.find(event => event.name === 'change').docs.length);
  assert.ok(entry('check-tag').slots.find(slot => slot.name === 'default').docs.length);
  assert.ok(entry('countdown').slots.find(slot => slot.name === 'prefix').docs.length);
});

test('template emissions and slots stay with their component, not sibling exports', () => {
  assert.deepEqual(entry('trend-chart').events.map(event => event.name), ['bar-click', 'zoom']);
  assert.ok(entry('table-column').slots.some(slot => slot.name === 'header'));
  assert.ok(entry('table').unparsed.some(item => item.part === '$emit event name'));
  assert.ok(entry('form').events.some(event => event.name === 'validate'), 'FormItem emits validate on its owning Form');
  assert.ok(!entry('form-item').events.some(event => event.name === 'validate'), 'validate is emitted on Form, not FormItem');
});

test('function defaults and static validator enums are read without execution', () => {
  assert.equal(entry('upload').props.find(prop => prop.name === 'onChange').default, 'function');
  assert.deepEqual(entry('quota-bar').props.find(prop => prop.name === 'mode').values, ['used', 'remain']);
  assert.deepEqual(entry('quota-bar').props.find(prop => prop.name === 'tone').values, ['', 'success', 'warning', 'danger']);
  assert.deepEqual(entry('table-column').props.find(prop => prop.name === 'sortOrders').values, ['ascending', 'descending', null]);
  assert.ok(!entry('avatar').props.find(prop => prop.name === 'size').values, 'number|string validator is not a finite enum');
});

test('--check is read-only, rejects drift and names changed components', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rumo-api-generator-'));
  const write = (file, content) => {
    const target = path.join(fixture, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  write('scripts/gen-api.js', fs.readFileSync(__filename.replace('.test.js', '.js'), 'utf8'));
  write('components.json', JSON.stringify({ button: './packages/button/index.js' }));
  write('package.json', '{"dependencies":{}}');
  write('src/index.js', "import Button from '../packages/button/index.js'; export default { Button };");
  write('packages/button/index.js', "export default { name: 'RumoButton', props: { text: Boolean } };");
  write('examples/docs/zh-CN/button.md', '## Button\n### Attributes\n| 参数 | 说明 |\n| --- | --- |\n| text | 文字 |\n');
  const run = args => spawnSync(process.execPath, [path.join(fixture, 'scripts/gen-api.js'), ...args], {
    encoding: 'utf8', env: Object.assign({}, process.env, { NODE_PATH: path.resolve(__dirname, '../node_modules') })
  });
  assert.equal(run(['--check']).status, 1, 'missing manifest fails');
  assert.equal(run([]).status, 0);
  const target = path.join(fixture, 'components.api.json');
  const before = fs.readFileSync(target, 'utf8');
  assert.equal(run([]).status, 0);
  assert.equal(fs.readFileSync(target, 'utf8'), before);
  assert.equal(run(['--check']).status, 0);
  write('packages/button/index.js', "export default { name: 'RumoButton', props: { text: Boolean, dashed: Boolean } };");
  const drift = run(['--check']);
  assert.equal(drift.status, 1);
  assert.match(drift.stderr, /API manifest differs: button/);
  assert.equal(fs.readFileSync(target, 'utf8'), before, '--check must not rewrite output');
  write('components.api.json', '{broken');
  assert.equal(run(['--check']).status, 1, 'malformed manifest fails');
});
