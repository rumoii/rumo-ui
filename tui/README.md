# @rumo/tui-internal

rumo 仓库内终端原生 TUI 工具(TypeScript + Ink)——在终端里交互式检索组件清单、导出 Vue 代码模板,无需启动浏览器 devServer。**仓库内部工程化工具,`private: true`,不发 npm。**

## 启动

```bash
npm --prefix tui install   # 首次:在 tui/ 内独立安装依赖(不污染根环境)
npm run tui                # 仓库根执行,拉起交互界面
```

**运行要求**:Node.js **>= 22**(ink 7 运行时硬性要求;`package.json` 的 `engines: >=18` 为方案合同原文,启动器会做实际守卫)。推荐 Windows Terminal;legacy cmd/PowerShell 需 UTF-8 代码页(`chcp 65001`)。

## 使用

### 交互界面(TTY)

`npm run tui` 进入首页提示符:

- `list` —— 组件清单(模糊过滤,↑↓ 移动,Enter 进入代码生成,ESC 返回)
- `help` —— 显示帮助
- `quit` —— 退出(Ctrl+C 亦可,均走六步清理)

代码生成视图:`print` 打印片段 / `export [文件名]` 导出 / `back` 返回 / `quit` 退出。

### 非交互模式(管道 / CI / AI Agent)

非 TTY 环境**自动降级**为静态逐行输出(不挂起、无全屏刷新),也可靠 `RUMO_TUI_MODE=static` 强制:

```bash
npm run tui -- --list [查询]         # 列出组件(id/label/group/path)
npm run tui -- --api button          # 查看 props/events/slots/methods 表格
npm run tui -- --api button --json   # 输出 API 清单的原始条目
npm run tui -- --snippet button      # 打印可编译的 Vue 2 单文件组件
npm run tui -- --export button out.vue   # 导出单文件组件
npm run tui -- --list --json         # JSON 输出
npm run tui -- --help / --version
```

退出码:`0` 成功 / `1` 运行失败 / `2` 参数错误。

`--api` 读取根目录已生成的 `components.api.json`,支持 id、导出名和标签名(忽略大小写、连字符)。未知组件返回 `2`,并给出模糊匹配建议。清单以 `components.json` 与源码为准,包含 mixin props 的来源、文档说明、未处理的 `mismatches`、带理由的已确认例外 `acknowledged` 和无法静态确认的 `unparsed`。文档的 Options 表保留在 `docs.options`,不当作 Vue props。服务和指令没有组件标签,`tag` 为 `null`。

### 推荐示例与 SFC 导出

在 `:::demo` 的紧邻上一行写 `<!-- snippet -->`,可指定推荐示例:

````markdown
<!-- snippet -->
:::demo 推荐用法
```html
<rumo-button type="primary">确认</rumo-button>
```
:::
````

没有标记时取本组件文档的第一个 demo;同页多个标记取第一个。没有独立示例时,按文件名顺序查找包含该组件标签的共享示例,同页优先推荐标记;仍找不到则输出明确标注的占位 SFC。

导出时把模板包进 `<template><div>…</div></template>`,保留 demo 的 `<script>` 和 `<style>`,没有脚本时补 `export default {}`。示例中已有的外层 `<template>` 会被解包,作用域插槽的内层 `<template>` 保留。在使用示例的 Vue 2.6 应用中,仍需注册所用的 Rumo 组件并引入样式。

### 更新与检查 API 清单

在仓库根目录执行:

```bash
npm run build:api                # 从源码/中文文档生成 components.api.json
npm run check:api                # 只读比较;清单过期、例外陈旧或有未处理的 mismatches 时退出 1
node scripts/gen-api.js --root <工作目录> --check --strict
node --test scripts/gen-api.test.js
npm run check:snippets           # 逐个导出整个 tui 目录,检查 Vue 模板与 Babel 6 脚本
```

清单格式由 `schemaVersion: 1` 标识,`components` 按 id 排序,不含时间戳。生成器只使用根目录直接声明的 `babel-core` 6 和 `vue-template-compiler`,不执行组件或默认值函数。非 JSON 常量默认值放在 `defaultExpression`;未声明的默认值省略 `default`,不推测 Vue 的隐式默认值。服务参数和实例 data 不当作 Vue props;动态事件名、动态插槽名及不能枚举的 validator 会说明在 `unparsed` 中。

已确认例外写入目标工作目录的 `scripts/api-exceptions/<组件 id>.json`,内容是数组,例如 `[{"kind":"source-only","group":"props","name":"openDelay","reason":"内部属性，不对使用者开放"}]`。`kind`、`group`、`name` 与出入条目一致;无 `group` 的 `ambiguous-doc-section` 用 `section` 匹配,`ambiguous-doc-row` 用 `section` 和 `name` 匹配。`reason` 必填且不能为空。命中项从 `mismatches` 移至 `acknowledged`,保留原条目和理由;格式错误时生成器报文件名并退出 1,匹配不到实际出入的陈旧例外会使 `--check` 退出 1。`--strict` 列出所有未处理项并退出 1,可单独使用或与 `--check`、`--root` 组合;默认仍处理脚本所在仓库。

全量 snippet 检查放在根目录 `scripts/check-snippets.js`,通过 tui 的真实 `--export` 处理函数逐项导出至系统 TEMP,再用根目录编译器验证。这样 tui 不引入根目录的编译依赖。此检查证明 SFC 语法可编译,不证明示例的所有交互或业务依赖已在浏览器运行。

## 组件(§6.2 合同,props 命名对齐 Web 线)

| 组件 | props | 按键 |
|---|---|---|
| `LogStream` | `lines: string[]`,`height: number`,`follow: boolean`,`filter?` | `f` 切跟随,`c` 清屏 |
| `TerminalPrompt` | `onSubmit: (cmd) => void`,`history: string[]`,`prefix?` | ↑↓ 历史,Tab 补全,Enter 提交 |
| `CommandSelect` | `items: Array<{id,label,detail}>`,`onSelect: (item) => void` | 输入过滤,↑↓ 移动,Enter 确认,ESC 退出 |

组件另有组合管道扩展属性(`active` 按键归属、`completions`、`onExit` 等),见源码注释。

## 架构红线

- **渲染抽象**:业务代码(components/views)只 import `src/primitives/`,不直接触 ink;`primitives/ink/` 是唯一适配层(未来 OpenTUI 换底接缝)。
- **Tokens**:`src/tokens/index.ts` 由 `scripts/gen-tokens.js` 从 `tokens/tokens.json` 生成(**勿手改**);共享颜色严禁硬编码,走 `primitives/colors.ts`(门禁 G3 强制)。
- **依赖隔离**:ink/react 等只在本包 `package.json`;根 webpack/`components.json`/发布包与 tui/ 无交集(门禁 G1/G2 强制)。
- **生命周期**:CLI 退出走六步拆除(定时器 → 按键监听 → stdin raw mode → ink unmount → 光标复位 → 定退出码),幂等可重入。

## 门禁与测试

```bash
npm --prefix tui run gates       # G1-G4 静态红线门禁
npm --prefix tui test            # 三组件合同 / catalog 提取 / CLI 两态与 API / 门禁自测
npm --prefix tui run typecheck   # tsc --noEmit
```

## 未实现(按方案范围)

- `<Badge>` / `<StatusMessage>`(方案 §2.2 重叠表提及、§6.2 未列)——推迟。
- OpenTUI 渲染器本体——只交付 `primitives/` 换底接缝。
