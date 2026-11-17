'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { spawnSync } = require('child_process');
const compiler = require('vue-template-compiler');
const babel = require('babel-core');

const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'rumo-snippet-check-'));
const moduleUrl = file => pathToFileURL(path.join(root, file)).href;
// Exercise the same --export path as the CLI, once for every catalog item.
// The compiler remains a root dependency; tui only reads docs and writes SFCs.
const child = spawnSync(process.execPath, [
  '--import', moduleUrl('tui/node_modules/tsx/dist/loader.mjs'), '--input-type=module', '--eval',
  `import { loadCatalog } from ${JSON.stringify(moduleUrl('tui/src/catalog/index.ts'))};
   import { runStatic } from ${JSON.stringify(moduleUrl('tui/src/host/static-runner.ts'))};
   import path from 'node:path';
   for (const item of loadCatalog()) {
     if (runStatic(['--export', item.id, path.join(${JSON.stringify(output)}, item.id + '.vue')]) !== 0) process.exit(1);
   }`
], { cwd: root, encoding: 'utf8', timeout: 60000 });
if (child.status !== 0) {
  console.error(child.stderr || child.error || 'Snippet export failed');
  process.exit(1);
}

let count = 0;
let failures = 0;
for (const file of fs.readdirSync(output).sort()) {
  const source = fs.readFileSync(path.join(output, file), 'utf8');
  const sfc = compiler.parseComponent(source);
  const errors = [];
  if (!sfc.template) errors.push('missing template');
  else errors.push(...compiler.compile(sfc.template.content).errors.map(error => error.msg || error));
  if (!sfc.script) errors.push('missing script');
  else {
    try {
      babel.transform(sfc.script.content, { babelrc: false, ast: true, code: false, parserOpts: { plugins: ['jsx', 'objectRestSpread', 'dynamicImport'] } });
    } catch (error) { errors.push(error.message); }
  }
  if (errors.length) {
    failures++;
    console.error('FAIL ' + file + ': ' + errors.join('; '));
  }
  count++;
}
const expected = Object.keys(require('../components.json'));
expected.forEach(id => {
  if (!fs.existsSync(path.join(output, id + '.vue'))) { failures++; console.error('FAIL missing export: ' + id); }
});
console.log(`Snippet compilation: ${count - failures}/${count} passed (${expected.length} registered components); exports: ${output}`);
process.exitCode = failures ? 1 : 0;
