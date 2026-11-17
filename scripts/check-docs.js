'use strict';

// 文档事实检查:过时/错误写法、demo 模板能否编译、色彩页色值是否来自主题、导航链接是否有对应文档。
// 用法:node scripts/check-docs.js [--root <仓库目录>]。不传 --root 时检查本脚本所在仓库。

const fs = require('fs');
const path = require('path');
const compiler = require('vue-template-compiler');

const rootArg = process.argv.indexOf('--root');
const rootDir = rootArg > -1
  ? path.resolve(process.argv[rootArg + 1])
  : path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'examples/docs');
const langs = ['zh-CN', 'en-US'];

const problems = [];
const report = (file, line, message) => {
  problems.push(`${path.relative(rootDir, file).replace(/\\/g, '/')}${line ? ':' + line : ''}  ${message}`);
};

const read = file => fs.readFileSync(file, 'utf8');
const listMd = lang => fs.readdirSync(path.join(docsDir, lang))
  .filter(name => name.endsWith('.md'))
  .map(name => path.join(docsDir, lang, name));

// 1. 不该再出现的写法:每条都对应仓库里不存在或已经过时的东西
const forbidden = [
  [/xnpm|rumo-cli/, '不存在的安装工具'],
  [/V1\.0\.0/, '过时的版本号'],
  [/IE9/, '不支持 IE9'],
  [/服务端渲染|server-side render/i, '未提供服务端渲染支持'],
  [/jsfiddle/i, '指向上游项目的在线演示'],
  [/unpkg\.com/, '未发布到 npm,CDN 地址不存在'],
  [/github\.com\/RumoUI/, 'GitHub 地址应为 github.com/rumoii/rumo-ui'],
  [/RumoUI-starter|vue init/, '不存在的项目模板'],
  [/rumo-theme/, '不存在的主题工具'],
  [/HTML\/RumoUI\//, '被误替换的 MDN 链接'],
  [/#0091ff/i, '与主题 token 不一致的主色'],
  [/\|\s*#409EFF\s*\|/i, 'API 默认值写成了上游主色,实际无默认值'],
  [/\$--color-primary:\s*#409EFF/i, '与主题 token 不一致的主色'],
  [/v-model:/, 'Vue 3 写法,Vue 2.6 不支持'],
  [/Preguntas/, '未本地化的西班牙语内容'],
  [/node 版本在 4\.0|master 分支/, '过时的环境说明']
];
const textFiles = [path.join(rootDir, 'README.md'), path.join(rootDir, 'FAQ.md')]
  .concat(...langs.map(listMd));
textFiles.forEach(file => {
  read(file).split(/\r?\n/).forEach((text, i) => {
    forbidden.forEach(([pattern, message]) => {
      if (pattern.test(text)) report(file, i + 1, message);
    });
  });
});

// 2. :::demo 里的模板必须能被 Vue 2 模板编译器编译(与 build/md-loader 的包裹方式一致)
const demoPattern = /^:::\s*demo[^\n]*\n[\s\S]*?```html\r?\n([\s\S]*?)```/gm;
langs.forEach(lang => listMd(lang).forEach(file => {
  const source = read(file);
  let match;
  while ((match = demoPattern.exec(source))) {
    const line = source.slice(0, match.index).split('\n').length;
    const template = match[1].replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
    const { errors } = compiler.compile(`<div>${template}</div>`);
    errors.forEach(error => report(file, line, `demo 模板编译失败:${error.split('\n')[0]}`));
    if (/v-model:/.test(template)) report(file, line, 'demo 使用了 Vue 3 的 v-model 参数写法');
  }
}));

// 3. 色彩页列出的色值必须是主题里真实定义的颜色
const themeColors = new Set(
  ['packages/theme-chalk/src/common/var.scss', 'packages/theme-chalk/src/common/tokens.scss']
    .map(file => read(path.join(rootDir, file)))
    .join('\n')
    .match(/#[0-9a-f]{6}\b/gi)
    .map(hex => hex.toLowerCase())
);
langs.forEach(lang => {
  const file = path.join(docsDir, lang, 'color.md');
  read(file).split(/\r?\n/).forEach((text, i) => {
    (text.match(/#[0-9a-f]{6}\b/gi) || []).forEach(hex => {
      if (!themeColors.has(hex.toLowerCase())) report(file, i + 1, `色值 ${hex} 不在 var.scss/tokens.scss 中`);
    });
  });
});

// 4. 导航里的每个文档路由都要有对应的 md 文件(与 examples/route.config.js 的解析方式一致)
const navConfig = JSON.parse(read(path.join(rootDir, 'examples/nav.config.json')));
const navFile = path.join(rootDir, 'examples/nav.config.json');
langs.forEach(lang => {
  const pages = [];
  navConfig[lang].forEach(nav => {
    if (nav.href) return;
    if (nav.groups) nav.groups.forEach(group => pages.push(...group.list));
    else if (nav.children) pages.push(...nav.children);
    else pages.push(nav);
  });
  pages.filter(page => page.path !== '/changelog').forEach(page => {
    if (!fs.existsSync(path.join(docsDir, lang, `${page.path}.md`))) {
      report(navFile, 0, `${lang} 导航 ${page.path} 没有对应文档 examples/docs/${lang}${page.path}.md`);
    }
  });
});

// 5. 快速上手的完整列表要覆盖 src/index.js 注册的全部组件
const registered = read(path.join(rootDir, 'src/index.js')).match(/const components = \[([\s\S]*?)\];/)[1].match(/\w+/g);
langs.forEach(lang => {
  const file = path.join(docsDir, lang, 'quickstart.md');
  const source = read(file);
  registered.filter(name => !new RegExp(`\\b${name}\\b`).test(source))
    .forEach(name => report(file, 0, `完整列表缺少 src/index.js 注册的组件 ${name}`));
});

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\ncheck-docs: ${problems.length} 个问题`);
  process.exit(1);
}
console.log('check-docs: 通过');
