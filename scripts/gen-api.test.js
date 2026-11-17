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
