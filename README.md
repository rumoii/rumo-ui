<div align="center">

# Rumo UI

**工程级 Vue 2 前端组件库 · 融合 Element Plus / Tabler 等开源精华 · MIT**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Vue](https://img.shields.io/badge/vue-2.6.x-green.svg)](https://vuejs.org/v2/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rumoii/rumo-ui/pulls)

</div>

在产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，给设计师和工程师带来很多困扰和重复建设，大大降低了产品的研发效率。我们经过大量的项目实践和总结，沉淀出一个设计语言 Rumo Design。旨在统一项目的前端 UI 设计，屏蔽不必要的设计差异和实现成本，解放设计和前端的研发资源。

Rumo Design 专为后台应用场景打造，致力于提升用户与产品设计师的使用体验。我们将 UI 设计师与 UX 设计师统称为产品设计师，模糊产品经理、交互设计师、视觉设计师、前端开发工程师与研发工程师之间的边界。依托统一的设计规范，Rumo Design 让设计与原型变得简单且易于上手，从而全面提升后台应用与产品的体验与研发效率。

**定位**：Rumo UI 的大部分组件整合自 Element UI、Element Plus 等开源项目，并加入自研的看板（Dash）、终端、命令面板等组件，主要供开发者和 AI 编码助手参考与复用：既可以整体引入，也可以把单个组件的源码和样式拿到自己的项目里。AI 编码助手请先读 [`AGENTS.md`](AGENTS.md)。

## ✨ 特性

- 🧱 **完整的组件体系** —— 100 多个组件（含 TableColumn 这类子组件），覆盖布局 / 表单 / 数据展示 / 导航 / 反馈等场景，完整清单见 `components.json`
- 🎨 **融合开源精华** —— 吸收 Element Plus、splitpanes、Tabler Icons 等优秀项目的组件与资产，来源全部标注、许可全部合规
- 🖼️ **500 个 SVG 图标** —— 内置 Tabler Icons 精选集，分组按需引入
- 🎬 **动效能力** —— animejs / countUp / 滚动显现三件套，内置 `v-animate`、`v-scroll-reveal` 指令
- 🔏 **实用增强组件** —— 水印（防删改）、手写签名、二维码、分栏面板、日志查看器、交互终端、命令面板
- 🎛️ **主题定制** —— theme-chalk SCSS 变量体系，一处换肤
- 🌐 **文档站** —— 每个组件含可运行示例与 API 文档；以中文文档为准，英文版大部分仍在翻译

## 🚀 快速上手

### 安装

Rumo UI 目前**没有发布到 npm**。克隆本仓库构建后，用 `npm pack` 打包再装进你的项目：

```shell
git clone https://github.com/rumoii/rumo-ui.git
cd rumo-ui
npm run bootstrap && npm run build
npm pack                 # 生成 rumo-ui-<版本号>.tgz

# 在你的项目目录
npm i /path/to/rumo-ui-<版本号>.tgz -S
```

其他方式（script 标签引入、只复用单个组件）见文档站「安装」一节（`examples/docs/zh-CN/installation.md`）。

### 引入

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'

import 'rumo-ui/lib/theme-chalk/index.css'

Vue.use(RumoUI)
```

按需引入的写法见文档站「快速上手」一节（`examples/docs/zh-CN/quickstart.md`）。

### 全局配置

在引入 Rumo UI 时，可以传入一个全局配置对象，例如改变组件的默认尺寸：

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'
Vue.use(RumoUI, { size: 'small' })
```

全部配置项（`size`、`zIndex`、`namespaceClass`、`getPopupContainer` 等）见「快速上手」的全局配置一节。

## 📖 文档

```shell
npm run dev   # 启动文档站 http://localhost:8085
```

## 🛠️ 开发

```shell
npm run bootstrap   # 安装依赖
npm run dev         # 启动文档站（http://localhost:8085）
npm run build       # 构建产物（lib/）
npm run check:docs  # 检查文档：过时写法、demo 模板编译、色值、导航链接
```

**仓库内工具**：`npm run tui` 拉起终端内组件检索 / 代码模板导出工具（`tui/`，`@rumo/tui-internal`，需 Node.js >= 22 与 `npm --prefix tui install`）。纯内部工程化工具，不随 npm 包发布；非 TTY 环境自动降级为静态输出，亦适合 AI Agent 调用。详见 [`tui/README.md`](tui/README.md)。

## 🌍 浏览器支持

现代 Chrome / Firefox / Edge / Safari（Vue 2 技术栈）。

## 📦 融合来源与许可

Rumo UI 融合了多个优秀开源项目的组件与资产，均在文件头与 `NOTICE` 中标注来源：

| 上游项目 | 许可 | 融合内容 |
| --- | --- | --- |
| Element UI | MIT | 组件库血统基座 |
| Element Plus | MIT | 缺口组件回移（文本 / 水印 / 结果 / 间距 / 分段 / 骨架屏 / 描述列表 / 统计 / 倒计时 / 头像组等 13 件） |
| splitpanes（v2.4.1） | MIT | 分栏面板 |
| vue-signature-pad + signature_pad | MIT | 手写签名 |
| qrcode | MIT | 二维码生成 |
| animejs | MIT | 动效引擎（Animate 组件与 v-animate 指令） |
| countup.js | MIT | 数字滚动 |
| AOS | MIT | 滚动显现（精简重写，未引入其运行时） |
| Tabler Icons | MIT | 精选 500 个 SVG 图标（SvgIcon 组件） |
| xterm.js（v5.3.0） | MIT | Web 终端仿真引擎（Terminal 交互终端组件，精确锁定版本） |
| xterm-addon-fit（v0.8.0） | MIT | xterm 自适应缩放插件 |
| ansi-to-html | MIT | ANSI 转 HTML（LogViewer 日志查看器） |
| ink（v7.1.1） | MIT | 终端 UI 渲染引擎（仓库内 `tui/` 工具，不随 npm 包发布） |
| react（v19.3.0） | MIT | ink 运行时依赖（仓库内 `tui/` 工具，不随 npm 包发布） |
| @inkjs/ui（v2.0.0） | MIT | ink 组件集（仓库内 `tui/` 工具，不随 npm 包发布） |
| tsx（v4.23.15） | MIT | TSX 运行时（仓库内 `tui/` 工具的开发期依赖，不随 npm 包发布） |

**许可说明**：以上项目均为 MIT 许可，与本库的 MIT 许可兼容。Element UI 是本库的基座，衍生自它的代码统一由 `NOTICE` 与 `licenses/Element-UI-LICENSE.txt` 说明；从其他项目移植的文件在文件头标注上游项目与版本。根目录 `NOTICE` 为来源索引，`licenses/` 目录保存各上游的完整许可文本。其中 animejs、countup.js、signature_pad、qrcode、ansi-to-html、xterm、xterm-addon-fit 以 npm 依赖方式引用，未拷贝其源码；ink、react、@inkjs/ui、tsx 为仓库内 `tui/` 工具的本地依赖（`tui/node_modules`），不进入发布包。

## 🤝 参与贡献

欢迎 Issue 与 Pull Request。

## License

[MIT](./LICENSE)
