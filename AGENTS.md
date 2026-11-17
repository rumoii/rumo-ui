# AGENTS.md

写给在本仓库里读代码、写代码，或者参考它生成代码的 AI 编码助手。

Rumo UI 是一个 **Vue 2.6** 组件库。大部分组件整合自 Element UI、Element Plus 等开源项目，另有自研的看板（Dash）、终端、命令面板等组件。它的用途是供人和模型参考、复用。

## 硬规则

- **只写 Vue 2.6 的代码。** 双向绑定用 `v-model` 或 `:prop.sync`；作用域插槽用 `slot-scope` 或 `v-slot`。组件自己 `$emit` 的事件直接监听，例如 Button 的 `@click`；组件没有 `$emit`、只在根元素上触发的原生 DOM 事件，才需要加 `.native`。不要写 Vue 3 语法：`v-model:xxx`、`<script setup>`、`defineProps`、`emits` 选项、`createApp`。
- **标签用 `rumo-` 前缀**，例如 `<rumo-button>`、`<rumo-table-column>`。不要写成 Element 的 `el-` 前缀，也不要照搬 Element Plus 的 API，两者有增删。
- **组件源码要能被 Babel 6 编译。** `packages/` 和 `src/` 由 Babel 6 + webpack 4 构建，不能用 `?.`、`??` 这类 ES2020 语法。
- **Dash 是可选皮肤。** Dash 的运行时 CSS 变量（`--rumo-*`）和暗色只在 `class="rumo-dash"` 的容器内生效。容器外的看板组件仍能显示，用的是变量的回退值。文档示例统一包一层容器，见 `examples/docs/zh-CN/dash-token.md`。不用 Dash 时以基础主题为准：`type="primary"` 使用主题主色；Button 的 `variant` 属于 Dash 视觉，与 `type` 互相独立。
- **不要直接运行 `npm run lint`、`npm run build`、`npm run dist`。** `lint` 带 `--fix`，会自动改文件；`build`/`dist` 里也会执行它。确实要构建时，事后用 `git status` 检查有没有多出来的改动。

## 事实以哪里为准

| 要知道什么 | 看哪里 |
| --- | --- |
| 有哪些组件 | `components.json`，以及 `src/index.js` 的导出 |
| 组件的 props、事件、方法 | `packages/<组件名>/src/` 源码，以源码为准 |
| 用法示例和 API 表 | `examples/docs/zh-CN/<组件名>.md`；英文版大部分仍在翻译，以中文为准 |
| 类型声明 | `types/<组件名>.d.ts`，入口是 `types/index.d.ts` |
| 主题色、字号等基础值 | `tokens/tokens.json`，以及 `packages/theme-chalk/src/common/var.scss` |
| 组件样式 | `packages/theme-chalk/src/<组件名>.scss` |
| 全局配置（`size`、`zIndex` 等） | `src/index.js` 的 `install`；说明见 `examples/docs/zh-CN/quickstart.md` |
| 上游来源与许可 | `NOTICE`、`licenses/`，以及移植文件的文件头 |

文档、类型和源码不一致时，以源码为准，并把不一致的地方报告出来。

## 生成文件，不要手改

| 文件 | 由谁生成 | 来源 |
| --- | --- | --- |
| `src/index.js` | `build/bin/build-entry.js` | `components.json` |
| `packages/theme-chalk/src/index.scss` | `build/bin/gen-cssfile.js` | `components.json` |
| `packages/theme-chalk/src/common/tokens*.scss`、`tui/src/tokens/index.ts` | `scripts/gen-tokens.js` | `tokens/tokens.json` |
| `examples/pages/<语言>/*.vue` | `build/bin/i18n.js` | `examples/pages/template/` |
| `lib/` | 构建 | 全仓 |

## 复用单个组件

把一个组件拿到别的 Vue 2.6 项目里时，需要带上：

1. 组件源码 `packages/<组件名>/`。
2. 它 `import` 到的 `src/` 下的公共代码，例如 `src/utils/`、`src/mixins/`、`src/locale/`。
3. 样式 `packages/theme-chalk/src/<组件名>.scss`，以及它 `@import` 的 `common/var.scss`、`mixins/` 等；用 Dart Sass（npm 包 `sass`）编译。
4. 组件依赖的第三方包，看根目录 `package.json` 的 `dependencies`。例如 Terminal 依赖 `xterm`，Qr 依赖 `qrcode`。
5. 弹出层类组件（Dialog、Message 等）会读取 `Vue.prototype.$RUMO`，需要先设置好，写法见 `examples/docs/zh-CN/quickstart.md` 的「按需引入」。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run check:docs` | 检查文档：过时写法、demo 模板能否编译、色彩页色值、导航链接、快速上手组件清单 |
| `npm run check:types` | 用 `test/types/` 检查类型声明；需要先执行 `npm --prefix tui install` |
| `npm run tui -- --list --json` | 以 JSON 列出全部组件；需要 Node.js 22+，并先执行 `npm --prefix tui install` |
| `npm run tui -- --snippet <组件名>` | 打印该组件文档里的第一个示例 |
| `npm run dev` | 启动文档站 http://localhost:8085 |
| `make new <组件名> [中文名]` | 新建组件骨架，并登记到 `components.json`、导航、类型和样式入口 |

开发和构建需要 Node.js 20（`.nvmrc`）。

## 改完后怎么自查

- 改了文档：运行 `npm run check:docs`。
- 改了类型：运行 `npm run check:types`。
- 改了组件：组件库目前**没有单元测试**（`make new` 生成的 `test/unit/specs/*.spec.js` 没有对应的运行器）。用 `npm run dev` 打开对应文档页，手工核对 demo。
