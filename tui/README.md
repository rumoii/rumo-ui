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
npm run tui -- --snippet button      # 打印组件 Vue 片段(首个文档 demo)
npm run tui -- --export button out.vue   # 导出片段到文件
npm run tui -- --list --json         # JSON 输出
npm run tui -- --help / --version
```

退出码:`0` 成功 / `1` 运行失败 / `2` 参数错误。

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
npm --prefix tui test            # 39 条:三组件合同 / catalog 提取 / CLI 两态 / 门禁自测
npm --prefix tui run typecheck   # tsc --noEmit
```

## 未实现(按方案范围)

- `<Badge>` / `<StatusMessage>`(方案 §2.2 重叠表提及、§6.2 未列)——推迟。
- OpenTUI 渲染器本体——只交付 `primitives/` 换底接缝。
