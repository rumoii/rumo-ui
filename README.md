<div align="center">

# Rumo UI

**工程级 Vue 2 前端组件库 · 融合 Element Plus / Tabler 等开源精华 · MIT**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Vue](https://img.shields.io/badge/vue-2.6.x-green.svg)](https://vuejs.org/v2/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rumoii/rumo-ui/pulls)

</div>

在产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，给设计师和工程师带来很多困扰和重复建设，大大降低了产品的研发效率。我们经过大量的项目实践和总结，沉淀出一个设计语言 Rumo Design。旨在统一项目的前端 UI 设计，屏蔽不必要的设计差异和实现成本，解放设计和前端的研发资源。

Rumo Design 专为后台应用场景打造，致力于提升用户与产品设计师的使用体验。我们将 UI 设计师与 UX 设计师统称为产品设计师，模糊产品经理、交互设计师、视觉设计师、前端开发工程师与研发工程师之间的边界。依托统一的设计规范，Rumo Design 让设计与原型变得简单且易于上手，从而全面提升后台应用与产品的体验与研发效率。

## ✨ 特性

- 🧱 **完整的组件体系** —— 109 个组件，覆盖布局 / 表单 / 数据展示 / 导航 / 反馈等场景
- 🎨 **融合开源精华** —— 吸收 Element Plus、splitpanes、Tabler Icons 等优秀项目的组件与资产，来源全部标注、许可全部合规
- 🖼️ **500 个 SVG 图标** —— 内置 Tabler Icons 精选集，分组按需引入
- 🎬 **动效能力** —— animejs / countUp / 滚动显现三件套，内置 `v-animate`、`v-scroll-reveal` 指令
- 🔏 **实用增强组件** —— 水印（防删改）、手写签名、二维码、分栏面板、日志查看器、交互终端、命令面板
- 🎛️ **主题定制** —— theme-chalk SCSS 变量体系，一处换肤
- 🌐 **中英双语文档站** —— 每个组件含可运行示例与 API 文档

## 🚀 快速上手

### 安装

```shell
npm i rumo-ui -S
```

### 引入

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'

Vue.use(RumoUI)

// or 按需引入
import {
  Select,
  Button
  // ...
} from 'rumo-ui'

Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
```

### 全局配置

在引入 Rumo UI 时，可以传入一个全局配置对象。该对象目前仅支持 size 字段，用于改变组件的默认尺寸。按照引入方式，具体操作如下：

完整引入：

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'
Vue.use(RumoUI, { size: 'small' })
```

按照以上设置，项目中所有拥有 size 属性的组件的默认尺寸均为 'small'。

## 📖 文档

```shell
npm run dev   # 启动文档站 http://localhost:8085
```

## 🛠️ 开发

```shell
npm run bootstrap   # 安装依赖
npm run dev         # 启动文档站（http://localhost:8085）
npm run build       # 构建产物（lib/）
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

**许可合规说明**：以上项目均为 MIT / Apache-2.0 宽松许可，与本库 MIT 许可完全兼容。每个移植文件的头部均标注上游项目与版本；根目录 `NOTICE` 为来源索引；`licenses/` 目录保存各上游的完整许可文本。所有合入代码均随副本保留版权与许可声明，**完全符合各上游许可要求**。其中 animejs、countup.js、signature_pad、qrcode、ansi-to-html、xterm、xterm-addon-fit 以 npm 依赖方式引用，未拷贝其源码；ink、react、@inkjs/ui、tsx 为仓库内 `tui/` 工具的本地依赖（`tui/node_modules`），不进入发布包。

## 🤝 参与贡献

欢迎 Issue 与 Pull Request。

## License

[MIT](./LICENSE)
