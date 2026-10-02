# 更新日志

## 未发布

- **Dash 卡片组件(6)+ 区间选择**：StatTile/StatGrid 统计磁贴(响应式栅格)、RankList 榜单(占比条)、BreakdownList 明细列表(可展开分组、行内占比覆盖层)、RatioCard 占比卡、InsightCard 要点卡、SortableCard 可拖卡片(原生指针事件拖拽排序);DateRangePreset 预设区间(预设胶囊 + daterange 自定义弹层)。Table 补 `is-missing`/`is-future` 行态与紧凑模式(demo 展示数据明细视图);新增「Dashboard 组合示例」页以同 mock 数据拼出完整看板
- **Dash 数据可视化组件(4)**：StackBar 分布条(比例条 + 图例 + 自定义数值格式)、TrendChart 趋势柱图(DOM 柱图、缺口插值、IQR 量程裁剪、tooltip 自动翻转)+ TrendZoom 放大弹窗(复用 dialog)、Heatmap 日历热力图(CSS Grid 周列、月标定位、滚动初始化到最近周)、QuotaBar 配额条(配速标记、used/remain 双语义、阈值变色)。全部手写 DOM/SVG,零图表库,符合 Babel 6 产物约束
- **Dash 原子吸收**：Button 新增 `variant`（primary/secondary/ghost）视觉分支；Card 增 `padding`/`interactive`；Badge 增 `size="sm"` 与 `variant="secondary"`；Input 增 `size="sm"`；Select 增 `empty-text` 与清除按钮视觉；Segmented 增 `variant="dash"` 与滑块过渡（含 reduced-motion）；message/message-box 增 `variant="card"` 卡片视觉（配 `dark` 暗色）；tooltip 增 `effect="card"` 玻璃卡气泡；CommandPalette 增 `variant="dash"`；Alert/Container 文档补「记住关闭」约定与看板外壳布局示例。均为加法能力，不使用新参数时渲染与 1.2.0 一致（Input focus 边框色为等值 CSS 变量替换）
- **Dash 皮肤层**：`tokens/tokens.json` 新增 `dash` 命名空间（强调色/中性灰/语义色/分类色板/字阶/圆角/阴影/间距/动效/断点，主色锚定 `#856AF9`），`scripts/gen-tokens.js` 新增单向生成 `tokens-dash.scss`（SCSS 变量）与 `tokens-dash-css.scss`（运行时 CSS 变量，`.rumo-dash` 作用域、`.is-dark` 暗色、OKLCH `@supports` 回退）；`dash-utils.scss` 提供 `.rumo-panel` / `.rumo-num` 与 min-height 断点 mixin。既有 token 输出零变化，文档新增「Dash 皮肤令牌」页（zh/en）

## 1.2.0 (2026-10-01)

Design Tokens 机制与 Web 端终端线组件（纯增量，非破坏性）：

- **基础设施**：Design Tokens 单一主源（`tokens/tokens.json`）经 `scripts/gen-tokens.js` 单向生成 `tokens.scss` 与 `tui/src/tokens/index.ts`，挂入 `build:file` / `build:theme`
- **终端线组件（2）**：LogViewer 日志查看器（虚拟滚动 + ansi-to-html 轻量 ANSI 解析）、Terminal 交互终端（xterm.js 仿真，`xterm@5.3.0` 与 `xterm-addon-fit@0.8.0` 精确锁定，锁定原因与迁移时机见组件源码注释与文档）
- **命令面板**：CommandPalette 快捷指令浮层（默认 Ctrl+K 唤起，过滤 / 键盘导航 / 可配置热键与作用域，零新依赖）
- **仓库内终端工具**：`tui/`（`@rumo/tui-internal`，private 不发 npm）——TypeScript + Ink 实现组件清单检索与 Vue 代码模板导出 CLI（`npm run tui`），含 LogStream / TerminalPrompt / CommandSelect 三个终端组件；非 TTY 自动降级静态输出；共享色走 Design Tokens，依赖与根工程完全隔离
- **i18n**：locale 缺失键多语言回落链（当前语言 → en → zh-CN）
- 引擎依赖新增：ansi-to-html、xterm、xterm-addon-fit
- 来源标注：`NOTICE` 与 `licenses/` 已同步；组件文档 zh-CN / en-US 双语交付

## 1.1.0

融合外部开源组件与资产(纯增量,非破坏性),新增 21 个组件包与 500 个 SVG 图标:

- **展示组件(4)**:Text 文本、Watermark 水印、Result 结果、Space 间距(回移自 Element Plus,MIT)
- **表单与数据组件(9)**:Segmented 分段控制器、CheckTag 可选标签、Skeleton/SkeletonItem 骨架屏、Descriptions/DescriptionsItem 描述列表、Statistic 统计数值、Countdown 倒计时、AvatarGroup 头像组(回移自 Element Plus,MIT)
- **第三方组件(4)**:Splitpanes/SplitPane 分栏(源自 splitpanes v2.4.1)、Signature 手写签名、Qr 二维码
- **动效(3)**:Animate 动效预设组件与 v-animate 指令(animejs 驱动)、Countup 数字滚动(countup.js 驱动)、ScrollReveal 滚动显现指令(AOS 精简重写)
- **图标(1)**:SvgIcon 矢量图标组件 + Tabler Icons 精选 500 个(8 组,`src/icons/tabler` 按组可引)
- 引擎依赖新增:animejs、countup.js、signature_pad、qrcode
- 来源标注:各移植文件头注明上游与版本,NOTICE 为索引,完整许可文本见 `licenses/` 目录

## 1.0.0

- 初始版本
