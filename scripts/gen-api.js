'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const compiler = require('vue-template-compiler');

function createGenerator(root = path.resolve(__dirname, '..')) {
root = path.resolve(root);
const registry = JSON.parse(fs.readFileSync(path.join(root, 'components.json'), 'utf8'));
const npmDependencies = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).dependencies;
const exceptions = readExceptions(root, registry);
const modules = new Map();
const slash = value => value.split(path.sep).join('/');
const relative = file => slash(path.relative(root, file));
const norm = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const kebab = value => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const key = node => node && (node.name || node.value);
const member = node => node && node.type === 'MemberExpression' && (!node.computed ? key(node.property) : literal(node.property).value);
const isFunction = node => node && /^(ObjectMethod|FunctionExpression|FunctionDeclaration|ArrowFunctionExpression)$/.test(node.type);

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node);
  Object.keys(node).forEach(name => {
    if (['loc', 'tokens', 'comments', 'leadingComments', 'trailingComments'].includes(name)) return;
    const value = node[name];
    if (Array.isArray(value)) value.forEach(child => walk(child, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  });
}

function literal(node) {
  if (!node) return { ok: false };
  if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral', 'NullLiteral'].includes(node.type)) {
    return { ok: true, value: node.type === 'NullLiteral' ? null : node.value };
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return { ok: true, value: node.quasis[0].value.cooked };
  }
  if (node.type === 'UnaryExpression' && ['-', '+', '!'].includes(node.operator)) {
    const arg = literal(node.argument);
    if (arg.ok) return { ok: true, value: node.operator === '-' ? -arg.value : node.operator === '+' ? +arg.value : !arg.value };
  }
  if (node.type === 'ArrayExpression') {
    const values = node.elements.map(literal);
    if (values.every(value => value.ok)) return { ok: true, value: values.map(value => value.value) };
  }
  if (node.type === 'ObjectExpression') {
    const result = {};
    for (const prop of node.properties) {
      const value = literal(prop.value);
      if (prop.computed || !key(prop.key) || !value.ok) return { ok: false };
      result[key(prop.key)] = value.value;
    }
    return { ok: true, value: result };
  }
  return { ok: false };
}

function resolveFile(from, request) {
  let base;
  if (request.startsWith('rumo-ui/')) base = path.join(root, request.slice(8));
  else if (request.startsWith('.')) base = path.resolve(path.dirname(from), request);
  else return null;
  return [base, base + '.js', base + '.vue', path.join(base, 'index.js'), path.join(base, 'index.vue')]
    .find(file => fs.existsSync(file) && fs.statSync(file).isFile()) || null;
}

function readModule(file) {
  if (modules.has(file)) return modules.get(file);
  const mod = { file, code: '', ast: null, template: null, bindings: new Map(), imports: new Map(), requests: [], exports: new Map(), error: null };
  modules.set(file, mod);
  try {
    const source = fs.readFileSync(file, 'utf8');
    const sfc = file.endsWith('.vue') ? compiler.parseComponent(source) : null;
    mod.template = sfc && sfc.template;
    mod.code = sfc ? (sfc.script ? sfc.script.content : '') : source;
    // Syntax-only parsing preserves object spreads, JSX and original source positions.
    mod.ast = babel.transform(mod.code, {
      babelrc: false, ast: true, code: false,
      parserOpts: { plugins: ['jsx', 'objectRestSpread', 'dynamicImport'] }
    }).ast;
    mod.ast.program.body.forEach(statement => {
      let node = statement;
      if (node.type === 'ImportDeclaration') {
        mod.requests.push(node.source.value);
        node.specifiers.forEach(spec => mod.imports.set(spec.local.name, {
          request: node.source.value,
          exported: spec.type === 'ImportDefaultSpecifier' ? 'default' : key(spec.imported)
        }));
      }
      if (node.type === 'ExportDefaultDeclaration') mod.exports.set('default', node.declaration);
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration && node.declaration.id) mod.exports.set(node.declaration.id.name, node.declaration);
        node.specifiers.forEach(spec => mod.exports.set(key(spec.exported), spec.local));
        node = node.declaration;
      }
      if (!node) return;
      if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(decl => { if (decl.id.type === 'Identifier') mod.bindings.set(decl.id.name, decl.init); });
      } else if (node.id && ['FunctionDeclaration', 'ClassDeclaration'].includes(node.type)) {
        mod.bindings.set(node.id.name, node);
      }
    });
  } catch (error) {
    mod.error = error.message.split('\n')[0];
  }
  return mod;
}

function resolve(node, mod, seen = new Set()) {
  if (!node) return { node, mod };
  if (node.type === 'Identifier') {
    const id = mod.file + ':' + node.name;
    if (seen.has(id)) return { node, mod };
    seen.add(id);
    if (mod.bindings.has(node.name)) return resolve(mod.bindings.get(node.name), mod, seen);
    const imported = mod.imports.get(node.name);
    if (imported) {
      const file = resolveFile(mod.file, imported.request);
      if (file) {
        const target = readModule(file);
        return resolve(target.exports.get(imported.exported), target, seen);
      }
    }
  }
  if (node.type === 'CallExpression' && member(node.callee) === 'extend' && node.arguments.length === 1) {
    return resolve(node.arguments[0], mod, seen);
  }
  if (node.type === 'MemberExpression') {
    const target = resolve(node.object, mod, new Set(seen));
    const name = member(node);
    if (target.node && target.node.type === 'ObjectExpression') {
      const prop = target.node.properties.find(item => !item.computed && key(item.key) === name);
      if (prop) return resolve(prop.type === 'ObjectMethod' ? prop : prop.value, target.mod, seen);
    }
  }
  return { node, mod };
}

function objectProperties(node, mod, warn, part) {
  const resolved = resolve(node, mod);
  if (!resolved.node || resolved.node.type !== 'ObjectExpression') {
    warn(resolved.mod, part, resolved.node);
    return [];
  }
  const out = [];
  resolved.node.properties.forEach(prop => {
    if (prop.type === 'SpreadProperty') {
      out.push(...objectProperties(prop.argument, resolved.mod, warn, part + ' spread'));
    } else if (prop.computed) {
      warn(resolved.mod, part + ' computed key', prop);
    } else out.push({ prop, mod: resolved.mod });
  });
  return out;
}

function optionsFor(node, mod, warn, seen = new Set()) {
  let result = resolve(node, mod);
  // A factory mixin's returned object can be read without executing the factory.
  if (result.node && result.node.type === 'CallExpression') {
    const factory = resolve(result.node.callee, result.mod);
    const returns = factory.node && factory.node.body && factory.node.body.body;
    const returned = returns && returns.filter(statement => statement.type === 'ReturnStatement');
    if (returned && returned.length === 1) result = resolve(returned[0].argument, factory.mod);
  }
  if (!result.node || result.node.type !== 'ObjectExpression') {
    warn(result.mod, 'component/mixin options', result.node);
    return [];
  }
  const id = result.mod.file + ':' + result.node.start;
  if (seen.has(id)) { warn(result.mod, 'cyclic mixin', result.node); return []; }
  const next = new Set(seen).add(id);
  const own = objectProperties(result.node, result.mod, warn, 'options');
  const inherited = [];
  own.forEach(({ prop, mod: owner }) => {
    if (key(prop.key) === 'extends') inherited.push(...optionsFor(prop.value, owner, warn, next));
    if (key(prop.key) === 'mixins') {
      const mixins = resolve(prop.value, owner);
      if (mixins.node && mixins.node.type === 'ArrayExpression') {
        mixins.node.elements.forEach(mixin => inherited.push(...optionsFor(mixin, mixins.mod, warn, next)));
      } else warn(owner, 'mixins', prop.value);
    }
  });
  return [...inherited, { node: result.node, mod: result.mod, properties: own }];
}

function propInfo(name, node, mod, warn) {
  const result = { name, type: null, required: false, source: relative(mod.file) };
  const resolved = resolve(node, mod);
  let type = resolved.node;
  let validator;
  if (type && type.type === 'ObjectExpression') {
    type = null;
    objectProperties(resolved.node, resolved.mod, warn, 'prop ' + name).forEach(({ prop, mod: owner }) => {
      const field = key(prop.key);
      if (field === 'type') type = prop.value;
      if (field === 'required') {
        const value = literal(prop.value);
        if (value.ok) result.required = value.value;
        else warn(owner, 'prop ' + name + ' required', prop.value);
      }
      if (field === 'default') {
        const resolvedDefault = resolve(prop.value, owner);
        const value = literal(resolvedDefault.node);
        if (isFunction(prop) || isFunction(resolvedDefault.node)) result.default = 'function';
        else if (value.ok) result.default = value.value;
        else {
          result.defaultExpression = owner.code.slice(prop.value.start, prop.value.end);
          // Infinity and undefined are JS constants, not JSON literals.
          if (!/^-?Infinity$|^undefined$/.test(result.defaultExpression)) warn(owner, 'prop ' + name + ' default', prop.value);
        }
      }
      if (field === 'validator') validator = { node: prop.type === 'ObjectMethod' ? prop : prop.value, mod: owner };
    });
  }
  if (type) {
    const types = type.type === 'ArrayExpression' ? type.elements : [type];
    if (types.every(value => value && value.type === 'Identifier' && /^(String|Number|Boolean|Array|Object|Function|Date|Symbol)$/.test(value.name))) {
      result.type = types.map(value => value.name);
    } else warn(mod, 'prop ' + name + ' type', type);
  }
  if (validator) {
    validator = resolve(validator.node, validator.mod);
    const values = validatorEnum(validator.node, validator.mod);
    if (values) result.values = values;
    else warn(validator.mod, 'prop ' + name + ' validator (not a finite static enum)', validator.node);
  }
  return result;
}

function validatorEnum(node, mod) {
  if (!isFunction(node) || !node.params[0] || node.params[0].type !== 'Identifier') return null;
  let expression = node.body;
  if (expression.type === 'BlockStatement') {
    // Branches or side effects may change the accepted domain; do not infer it.
    if (expression.body.length !== 1 || expression.body[0].type !== 'ReturnStatement') return null;
    expression = expression.body[0].argument;
  }
  const parameter = node.params[0].name;
  const isParameter = value => value && value.type === 'Identifier' && value.name === parameter;
  const listOf = value => {
    if (!value || value.type !== 'CallExpression' || !['indexOf', 'includes'].includes(member(value.callee)) || !isParameter(value.arguments[0])) return null;
    const list = literal(resolve(value.callee.object, mod).node);
    return list.ok && Array.isArray(list.value) ? list.value : null;
  };
  function valuesOf(value) {
    if (!value) return null;
    if (value.type === 'LogicalExpression' && value.operator === '||') {
      const left = valuesOf(value.left);
      const right = valuesOf(value.right);
      return left && right ? [...left, ...right] : null;
    }
    if (value.type === 'BinaryExpression' && ['===', '=='].includes(value.operator)) {
      const target = isParameter(value.left) ? value.right : isParameter(value.right) ? value.left : null;
      const result = literal(resolve(target, mod).node);
      if (result.ok && value.operator === '===') return [result.value];
    }
    if (value.type === 'BinaryExpression' && ((['>', '!==', '!='].includes(value.operator) && literal(value.right).value === -1) || (value.operator === '>=' && literal(value.right).value === 0))) return listOf(value.left);
    if (value.type === 'CallExpression' && member(value.callee) === 'includes') return listOf(value);
    // Array-valued props can constrain each item to a finite set.
    if (value.type === 'CallExpression' && member(value.callee) === 'every' && isParameter(value.callee.object)) return validatorEnum(value.arguments[0], mod);
    return null;
  }
  return valuesOf(expression);
}

function splitRow(line) {
  const cells = [];
  let value = '';
  let quote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '\\' && line[i + 1] === '|') { value += '|'; i++; }
    else if (ch === '`') { quote = !quote; value += ch; }
    else if (ch === '|' && !quote) { cells.push(value.trim()); value = ''; }
    else value += ch;
  }
  cells.push(value.trim());
  if (!cells[0]) cells.shift();
  if (!cells[cells.length - 1]) cells.pop();
  return cells;
}

const docsDir = path.join(root, 'examples/docs/zh-CN');
const docFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.md')).sort();
const docTexts = new Map(docFiles.map(file => [file, fs.readFileSync(path.join(docsDir, file), 'utf8')]));

function headingOwner(title) {
  const name = title.replace(/`/g, '').replace(/\s+(?:Attributes?|Props|Events|(?:Scoped\s+)?Slots?|Methods|Options)\s*$/i, '').trim();
  const english = name.match(/^[a-z][a-z0-9 -]*/i);
  if (!english) return null;
  const nameId = norm(english[0]);
  // These headings use shorter names than the registered component ids.
  const aliases = { dropdownmenuitem: 'dropdown-item', menugroup: 'menu-item-group' };
  return Object.keys(registry).find(id => norm(id) === nameId) ||
    (Object.prototype.hasOwnProperty.call(registry, aliases[nameId]) ? aliases[nameId] : null);
}

function docNames(row, group) {
  return row.name.replace(/\s*\(v-model\)\s*$/i, '').split(/\s*\/\s*/)
    .filter(name => name !== 'v-model')
    .map(name => group === 'props' ? norm(name) : group === 'methods' ? name.replace(/\(\s*\)$/, '').trim() : group === 'slots' && ['—', '-', '默认'].includes(name) ? 'default' : name);
}

function docsFor(id, sourceFile, sourceGroups, mismatches, unparsed) {
  let file = docFiles.find(name => norm(name.slice(0, -3)) === norm(id));
  if (!file) {
    file = docFiles.find(name => docTexts.get(name).split('\n').some(line => {
      const heading = line.match(/^#{2,5}\s+(.+)/);
      return heading && headingOwner(heading[1]) === id;
    }));
  }
  if (!file) {
    const sourcePackage = relative(sourceFile).split('/')[1];
    file = docFiles.find(name => norm(name.slice(0, -3)) === norm(sourcePackage));
  }
  const empty = { props: [], events: [], slots: [], methods: [], options: [] };
  if (!file) return { file: null, tables: empty };
  const lines = docTexts.get(file).split(/\r?\n/);
  const tables = empty;
  let context = headingOwner(file.slice(0, -3));
  let section = null;
  let fenced = false;
  let firstHeading = true;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) { fenced = !fenced; continue; }
    if (fenced) continue;
    const heading = lines[i].match(/^(#{2,5})\s+(.+)/);
    if (heading) {
      const title = heading[2].trim();
      const api = title.match(/^(.*?)\s*(Attributes?|Props|Events|(?:Scoped\s+)?Slots?|Methods|Options|属性|事件|插槽|方法)\s*$/i);
      const explicitOwner = headingOwner(title);
      if (!api && heading[1].length === 2) {
        context = explicitOwner || (firstHeading ? context : null);
        firstHeading = false;
      }
      section = null;
      const combined = {
        'events / slots': ['events', 'slots'],
        'methods / events': ['methods', 'events'],
        '方法与事件': ['methods', 'events'],
        '组件属性与方法': ['props', 'methods']
      }[title.toLowerCase()];
      if (combined && context === id) {
        section = { title, groups: combined };
      } else if (api) {
        const prefix = api[1].trim();
        // Nested option objects belong to the current component, not Vue props.
        const owner = (prefix ? headingOwner(prefix) : context) || (api[2].toLowerCase() === 'options' ? context : null);
        if (owner === id) {
          const type = api[2].toLowerCase();
          const group = type === 'options' ? 'options' : /attributes?|props|属性/.test(type) ? 'props' : /events|事件/.test(type) ? 'events' : /slots?|插槽/.test(type) ? 'slots' : 'methods';
          section = { title, group };
        } else if (!owner) {
          section = { title, group: null };
        }
      }
      continue;
    }
    if (!section || !/^\s*\|/.test(lines[i]) || !/^\s*\|[\s:|\-]+$/.test(lines[i + 1] || '')) continue;
    if (!section.group && !section.groups) {
      mismatches.push({ kind: 'ambiguous-doc-section', file: 'examples/docs/zh-CN/' + file, section: section.title });
      continue;
    }
    const headers = splitRow(lines[i]);
    i += 2;
    while (i < lines.length && /^\s*\|/.test(lines[i])) {
      const cells = splitRow(lines[i]);
      const row = { name: (cells[0] || '').replace(/`/g, ''), file: 'examples/docs/zh-CN/' + file, section: section.title, description: cells[1] || '' };
      const columns = {};
      headers.forEach((header, index) => {
        columns[header] = cells[index] || '';
        if (/^(可选值|选项|Accepted Values)$/i.test(header)) row.values = cells[index] || '';
        if (/^(默认值|默认|Default)$/i.test(header)) row.default = cells[index] || '';
        if (/^(类型|Type)$/i.test(header)) row.type = cells[index] || '';
        if (/参数|Parameters|Arguments|Scope/i.test(header) && index > 1) row.parameters = cells[index] || '';
      });
      row.columns = columns;
      if (cells.length !== headers.length) {
        row.cells = cells;
        unparsed.push({ file: row.file, part: section.title + ' table row ' + (i + 1), reason: 'column count differs; original cells retained' });
      }
      if (section.groups) {
        const groups = section.groups.filter(group => docNames(row, group).every(name =>
          Array.from(sourceGroups[group].keys()).some(sourceName => (group === 'props' ? norm(sourceName) : sourceName) === name)));
        if (groups.length === 1) tables[groups[0]].push(row);
        else mismatches.push({ kind: 'ambiguous-doc-row', file: row.file, section: row.section, name: row.name });
      } else tables[section.group].push(row);
      i++;
    }
    i--;
  }
  return { file: 'examples/docs/zh-CN/' + file, tables };
}

function generate() {
  const index = readModule(path.join(root, 'src/index.js'));
  if (index.error) throw new Error(index.error);
  const exported = new Map();
  const defaultExport = index.exports.get('default');
  if (!defaultExport || defaultExport.type !== 'ObjectExpression') throw new Error('src/index.js default export must be an object');
  defaultExport.properties.forEach(prop => {
    const imported = prop.value && index.imports.get(prop.value.name);
    if (imported) exported.set(resolveFile(index.file, imported.request), key(prop.key));
  });
  return { schemaVersion: 1, components: Object.keys(registry).sort().map(id => {
    const entry = path.resolve(root, registry[id]);
    const mismatches = [];
    const unparsed = [];
    const warn = (mod, part, node) => unparsed.push({ file: relative(mod.file), part, reason: node ? 'unsupported ' + node.type + ': ' + mod.code.slice(node.start, node.end).replace(/\s+/g, ' ').slice(0, 160) : mod.error || 'definition not found' });
    const initial = readModule(entry);
    const main = resolve(initial.exports.get('default'), initial);
    const kind = isFunction(main.node) || (main.node && main.node.type === 'ObjectExpression' && main.node.properties.some(prop => key(prop.key) === 'service')) ? 'service' : main.node && main.node.type === 'ObjectExpression' && main.node.properties.some(prop => ['bind', 'inserted', 'unbind'].includes(key(prop.key))) ? 'directive' : 'component';
    const options = kind === 'component' ? optionsFor(main.node, main.mod, warn) : [];
    const props = new Map();
    const methods = new Map();
    const events = new Map();
    const slots = new Map();
    let componentName = null;
    let model = null;
    const add = (collection, name, mod) => {
      if (typeof name !== 'string') return;
      if (!collection.has(name)) collection.set(name, { name, sources: [] });
      const sources = collection.get(name).sources;
      if (!sources.includes(relative(mod.file))) sources.push(relative(mod.file));
    };
    function scan(node, mod, scanSlots, delegatedOnly = false, parentEmits = false) {
      walk(node, value => {
        if (value.type === 'CallExpression' && (member(value.callee) === '$emit' || value.callee.type === 'Identifier' && value.callee.name === '$emit')) {
          const receiver = value.callee.object;
          const self = !receiver || receiver.type === 'ThisExpression';
          const receiverName = receiver && (receiver.name || member(receiver));
          const targetsOwner = typeof receiverName === 'string' && [norm(id), norm(componentName || '')].includes(norm(receiverName));
          if (self ? delegatedOnly : !targetsOwner && !(parentEmits && receiverName === '$parent')) return;
          const event = literal(value.arguments[0]);
          if (event.ok) add(events, event.value, mod);
          else warn(mod, '$emit event name', value.arguments[0]);
        }
        if (scanSlots && value.type === 'MemberExpression' && ['$slots', '$scopedSlots'].includes(member(value.object) || value.object.name)) {
          const name = value.computed ? literal(value.property).value : key(value.property);
          if (typeof name === 'string') add(slots, name, mod);
          else warn(mod, 'slot name', value);
        }
      });
    }
    const scanned = new Set();
    function scanModule(mod, scanSlots, delegatedOnly = false, parentEmits = false) {
      if (scanned.has(mod.file)) return;
      scanned.add(mod.file);
      scan(mod.ast, mod, scanSlots, delegatedOnly, parentEmits);
      if (mod.template) {
        const result = compiler.compile(mod.template.content, { outputSourceRange: true });
        if (result.errors.length) unparsed.push({ file: relative(mod.file), part: 'template', reason: result.errors.map(error => error.msg || error).join('; ') });
        // The generated render AST includes inline $emit calls and slot access.
        try {
          const renderCode = 'function render(){' + result.render + '}';
          const renderMod = Object.assign({}, mod, { code: renderCode });
          scan(babel.transform(renderCode, { babelrc: false, ast: true, code: false, sourceType: 'script' }).ast, renderMod, scanSlots, delegatedOnly, parentEmits);
        } catch (error) { unparsed.push({ file: relative(mod.file), part: 'template render', reason: error.message.split('\n')[0] }); }
        if (scanSlots) {
          const visit = node => {
            if (!node || node.type !== 1) return;
            if (node.tag === 'slot') {
              if (node.attrsMap[':name'] || node.attrsMap['v-bind:name']) warn(mod, 'dynamic template slot name');
              else add(slots, node.attrsMap.name || 'default', mod);
            }
            (node.children || []).forEach(visit);
            (node.ifConditions || []).slice(1).forEach(condition => visit(condition.block));
            Object.values(node.scopedSlots || {}).forEach(visit);
          };
          visit(result.ast);
        }
      }
    }
    options.forEach(option => {
      option.properties.forEach(({ prop, mod }) => {
        const name = key(prop.key);
        if (name === 'name') componentName = literal(prop.value).value || componentName;
        if (name === 'props') {
          const value = resolve(prop.value, mod);
          if (value.node && value.node.type === 'ArrayExpression') {
            value.node.elements.forEach(item => {
              const result = literal(item);
              if (result.ok) props.set(result.value, { name: result.value, type: null, required: false, source: relative(value.mod.file) });
              else warn(value.mod, 'props array item', item);
            });
          } else objectProperties(prop.value, mod, warn, 'props').forEach(({ prop: item, mod: owner }) => props.set(key(item.key), propInfo(key(item.key), item.value, owner, warn)));
        }
        if (name === 'methods') objectProperties(prop.value, mod, warn, 'methods').forEach(({ prop: method, mod: owner }) => methods.set(key(method.key), { name: key(method.key), source: relative(owner.file) }));
        if (name === 'model') {
          const values = objectProperties(prop.value, mod, warn, 'model');
          model = {};
          values.forEach(({ prop: field, mod: owner }) => {
            const value = literal(field.value);
            if (value.ok) model[key(field.key)] = value.value;
            else warn(owner, 'model ' + key(field.key), field.value);
          });
        }
      });
      scan(option.node, option.mod, true);
      // Scan only this options object, not unrelated component options in the file.
      if (option.mod.template) scanModule(option.mod, true);
    });
    const sourceDependencies = new Set();
    const packageDependencies = new Set();
    const visited = new Set();
    const packageRoot = path.join(root, 'packages', relative(main.mod.file).split('/')[1]);
    function graph(file) {
      if (visited.has(file)) return;
      visited.add(file);
      const mod = readModule(file);
      if (mod.error) { warn(mod, 'parse source'); return; }
      if (file.startsWith(packageRoot + path.sep)) scanModule(mod, file === main.mod.file, file !== main.mod.file && !options.some(option => option.mod.file === file), file !== main.mod.file);
      const requests = mod.requests.slice();
      walk(mod.ast, node => {
        if (node.type === 'CallExpression' && node.callee.name === 'require' && literal(node.arguments[0]).ok) requests.push(literal(node.arguments[0]).value);
      });
      requests.forEach(request => {
        const target = resolveFile(file, request);
        const pkg = request.startsWith('@') ? request.split('/').slice(0, 2).join('/') : request.split('/')[0];
        if (npmDependencies[pkg]) packageDependencies.add(pkg);
        if (!target || !/\.(js|vue)$/.test(target)) return;
        if (relative(target).startsWith('src/')) sourceDependencies.add(relative(target));
        if (target.startsWith(packageRoot + path.sep) || relative(target).startsWith('src/')) graph(target);
      });
    }
    graph(entry);
    if (kind === 'component') {
      // Siblings can emit on an injected owner (e.g. FormItem -> rumoForm)
      // without being imported by that owner. Their own events stay separate.
      const scanDelegates = dir => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
          const target = path.join(dir, file.name);
          if (file.isDirectory()) scanDelegates(target);
          else if (/\.(js|vue)$/.test(file.name) && !scanned.has(target)) {
            const mod = readModule(target);
            if (mod.error) warn(mod, 'parse delegated events');
            else scanModule(mod, false, true);
          }
        });
      };
      scanDelegates(packageRoot);
    }
    if (kind !== 'component') {
      scanModule(main.mod, true);
      // Service factories return Vue instances; documented instance methods live
      // in their imported component options, not in a Vue `props` declaration.
      if (kind === 'service') visited.forEach(file => {
        if (!file.startsWith(packageRoot + path.sep) || !file.endsWith('.vue')) return;
        const mod = readModule(file);
        optionsFor(mod.exports.get('default'), mod, warn).forEach(option => {
          option.properties.filter(({ prop }) => key(prop.key) === 'methods').forEach(({ prop, mod: owner }) => {
            objectProperties(prop.value, owner, warn, 'service instance methods').forEach(({ prop: method, mod: origin }) => {
              methods.set(key(method.key), { name: key(method.key), source: relative(origin.file) });
            });
          });
        });
      });
      // Services expose constructor data/options rather than Vue props.
      if (kind === 'service') unparsed.push({ file: relative(main.mod.file), part: 'service options', reason: 'service arguments/data are not Vue props; only declared props are listed' });
    }
    const exportName = exported.get(entry) || null;
    if (!exportName) warn(initial, 'src/index.js export name');
    if (kind === 'component' && !componentName) warn(main.mod, 'component name', main.node);
    const docs = docsFor(id, main.mod.file, { props, events, slots, methods }, mismatches, unparsed);
    const attach = (items, group) => Array.from(items.values()).sort((a, b) => a.name.localeCompare(b.name, 'en')).map(item => {
      const rows = docs.tables[group].filter(row => docNames(row, group).includes(group === 'props' ? norm(item.name) : item.name));
      if (item.sources) item.sources.sort();
      return Object.assign(item, { docs: rows });
    });
    ['props', 'events'].forEach(group => {
      const source = group === 'props' ? props : events;
      const normalize = group === 'props' ? norm : value => value;
      docs.tables[group].forEach(row => {
        const names = docNames(row, group);
        names.forEach(name => {
          if (!Array.from(source.keys()).some(sourceName => normalize(sourceName) === name)) mismatches.push({ kind: 'docs-only', group, name: names.length === 1 ? row.name : name, file: row.file, section: row.section });
        });
      });
      source.forEach((item, name) => {
        if (!docs.tables[group].some(row => docNames(row, group).includes(normalize(name)))) mismatches.push({ kind: 'source-only', group, name, file: item.source || item.sources[0] });
      });
    });
    const acknowledged = [];
    const unresolved = [];
    uniqueSorted(mismatches).forEach(item => {
      const exception = (exceptions.get(id) || []).find(record => exceptionKey(record.value) === exceptionKey(item));
      if (exception) {
        exception.matched = true;
        acknowledged.push(Object.assign({}, item, { reason: exception.value.reason }));
      } else unresolved.push(item);
    });
    const optionalFile = file => fs.existsSync(path.join(root, file)) ? file : null;
    return {
      id, exportName, tag: kind === 'component' && componentName ? kebab(componentName) : null, kind,
      files: { entry: relative(entry), source: relative(main.mod.file), style: optionalFile('packages/theme-chalk/src/' + id + '.scss'), types: optionalFile('types/' + id + '.d.ts'), docs: docs.file },
      props: attach(props, 'props'), model, events: attach(events, 'events'), slots: attach(slots, 'slots'),
      methods: attach(new Map(Array.from(methods).filter(([name]) => docs.tables.methods.some(row => docNames(row, 'methods').includes(name)))), 'methods'),
      dependencies: { source: Array.from(sourceDependencies).sort(), npm: Array.from(packageDependencies).sort() },
      docs: docs.tables,
      mismatches: unresolved, acknowledged: uniqueSorted(acknowledged), unparsed: uniqueSorted(unparsed)
    };
  }) };
}

return { generate, exceptions };
}

function generate(root) {
  return createGenerator(root).generate();
}

function exceptionKey(item) {
  return JSON.stringify([item.kind, item.group, item.section && !item.group ? item.section : null, item.name]);
}

function readExceptions(root, registry) {
  const directory = path.join(root, 'scripts/api-exceptions');
  const result = new Map();
  if (!fs.existsSync(directory)) return result;
  fs.readdirSync(directory).filter(file => file.endsWith('.json')).sort().forEach(file => {
    const relative = 'scripts/api-exceptions/' + file;
    const fail = message => { throw new Error('Invalid API exceptions: ' + relative + ': ' + message); };
    const id = file.slice(0, -5);
    if (!Object.prototype.hasOwnProperty.call(registry, id)) fail('unknown component id');
    let values;
    try { values = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')); }
    catch (error) { fail(error.message); }
    if (!Array.isArray(values)) fail('expected an array');
    const seen = new Set();
    const records = values.map((value, index) => {
      const invalid = message => fail('entry ' + (index + 1) + ': ' + message);
      if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('expected an object');
      const fields = {
        'source-only': ['group', 'name'],
        'docs-only': ['group', 'name'],
        'ambiguous-doc-section': ['section'],
        'ambiguous-doc-row': ['section', 'name']
      };
      const required = Object.prototype.hasOwnProperty.call(fields, value.kind) && fields[value.kind];
      if (!required) invalid('unknown kind');
      const allowed = ['kind', 'reason', ...required];
      if (Object.keys(value).some(field => !allowed.includes(field))) invalid('unexpected field');
      allowed.forEach(field => {
        if (typeof value[field] !== 'string' || !value[field].trim()) invalid(field + ' must be a non-empty string');
      });
      if (value.group && !['props', 'events'].includes(value.group)) invalid('group must be props or events');
      const key = exceptionKey(value);
      if (seen.has(key)) invalid('duplicate match');
      seen.add(key);
      return { file: relative, value, matched: false };
    });
    result.set(id, records);
  });
  return result;
}

function uniqueSorted(items) {
  return Array.from(new Map(items.map(item => [JSON.stringify(item), item])).values())
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'));
}

function main() {
  const rootArg = process.argv.indexOf('--root');
  if (rootArg !== -1 && (!process.argv[rootArg + 1] || process.argv[rootArg + 1].startsWith('--'))) {
    throw new Error('--root requires a directory');
  }
  const root = rootArg === -1 ? path.resolve(__dirname, '..') : path.resolve(process.argv[rootArg + 1]);
  const check = process.argv.includes('--check');
  const target = path.join(root, 'components.api.json');
  const generator = createGenerator(root);
  const result = generator.generate();
  const content = JSON.stringify(result, null, 2) + '\n';
  if (check) {
    generator.exceptions.forEach(records => records.forEach(record => {
      if (!record.matched) {
        console.error('Stale API exception: ' + record.file + ': ' + JSON.stringify(record.value));
        process.exitCode = 1;
      }
    }));
    const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
    if (previous !== content) {
      let old = { components: [] };
      try { old = JSON.parse(previous); } catch (_) { /* Missing/invalid output is stale. */ }
      const byId = new Map((old.components || []).map(item => [item.id, item]));
      const changed = result.components.filter(item => JSON.stringify(item) !== JSON.stringify(byId.get(item.id))).map(item => item.id);
      byId.forEach((item, id) => { if (!result.components.some(value => value.id === id)) changed.push(id); });
      console.error('API manifest differs: ' + (changed.sort().join(', ') || 'schema/format'));
      process.exitCode = 1;
    } else console.log('API manifest up to date: ' + result.components.length + ' entries');
  } else {
    fs.writeFileSync(target, content, 'utf8');
    console.log('Generated components.api.json: ' + result.components.length + ' entries');
  }
  if (process.argv.includes('--strict')) {
    const unresolved = result.components.filter(component => component.mismatches.length);
    const count = unresolved.reduce((total, component) => total + component.mismatches.length, 0);
    if (count) {
      console.error('Unresolved API mismatches: ' + unresolved.length + ' components, ' + count + ' entries');
      unresolved.forEach(component => component.mismatches.forEach(item => console.error(component.id + ': ' + JSON.stringify(item))));
      process.exitCode = 1;
    }
  }
}

if (require.main === module) {
  try { main(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { generate };
