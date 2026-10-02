[toc]

## Dash 皮肤令牌

Dash 皮肤层面向数据看板场景,提供一套运行时 CSS 自定义变量与配套 SCSS 变量。与全局主题隔离:所有变量挂在 `.rumo-dash` 作用域下,暗色态由 `.rumo-dash.is-dark` 覆盖,不影响既有组件。

### 强调色

主色锚定品牌紫 `#856AF9`,50–950 为按亮度单调的完整色阶。
:::demo
```html
<div class="rumo-dash" style="display: flex; flex-wrap: wrap; gap: 8px;">
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-50);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-100);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-200);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-300);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-400);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-600);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-700);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-800);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-900);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-950);"></div>
</div>
```
:::

### 中性灰与语义色

中性灰带轻微紫色相,与主色协调;语义色提供 `success` / `warning` / `danger` / `info`;`series-1` 至 `series-8` 为通用分类色板,图表组件默认循环使用,业务可按需覆盖。
:::demo
```html
<div class="rumo-dash" style="display: flex; flex-wrap: wrap; gap: 8px;">
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-50); border: 1px solid var(--rumo-c-neutral-200);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-200);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-400);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-600);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-800);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-success);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-warning);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-danger);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-info);"></div>
</div>
<div class="rumo-dash" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;">
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-1);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-2);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-3);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-4);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-5);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-6);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-7);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-8);"></div>
</div>
```
:::

### 面板与圆角阴影

`.rumo-panel` 为看板主容器样式(不嵌套使用);`.rumo-num` 启用等宽数字。
:::demo
```html
<div class="rumo-dash" style="display: flex; gap: 16px; align-items: flex-start;">
  <div class="rumo-panel" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">总调用量</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight);">128,450</div>
  </div>
  <div class="rumo-panel rumo-panel--strong" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">环比上周</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight); color: var(--rumo-c-success);">+12.4%</div>
  </div>
</div>
```
:::

### 暗色模式

在皮肤容器上追加 `is-dark` 类即可切换暗色令牌,组件无需改动。
:::demo
```html
<div class="rumo-dash is-dark" style="display: flex; gap: 16px; align-items: flex-start; background: var(--rumo-c-paper); padding: 16px; border-radius: var(--rumo-radius-lg);">
  <div class="rumo-panel" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">总调用量</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight);">128,450</div>
  </div>
  <div class="rumo-panel rumo-panel--strong" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">环比上周</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight); color: var(--rumo-c-success);">+12.4%</div>
  </div>
</div>
```
:::

### 字阶

字阶覆盖从展示级大数字到标签文本的完整层级,数值列建议配合 `.rumo-num`。
:::demo
```html
<div class="rumo-dash">
  <div style="font-size: var(--rumo-text-display-sm-size); line-height: var(--rumo-text-display-sm-lh); font-weight: var(--rumo-text-display-sm-weight); letter-spacing: var(--rumo-text-display-sm-ls);">Display 56</div>
  <div style="font-size: var(--rumo-text-hero-size); line-height: var(--rumo-text-hero-lh); font-weight: var(--rumo-text-hero-weight); letter-spacing: var(--rumo-text-hero-ls);">Hero 48</div>
  <div style="font-size: var(--rumo-text-h1-size); line-height: var(--rumo-text-h1-lh); font-weight: var(--rumo-text-h1-weight);">H1 36</div>
  <div style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight);">H2 28</div>
  <div style="font-size: var(--rumo-text-h3-size); line-height: var(--rumo-text-h3-lh); font-weight: var(--rumo-text-h3-weight);">H3 22</div>
  <div style="font-size: var(--rumo-text-body-size); line-height: var(--rumo-text-body-lh);">Body 16 正文</div>
  <div style="font-size: var(--rumo-text-body-sm-size); line-height: var(--rumo-text-body-sm-lh);">Body-sm 14 次要正文</div>
  <div style="font-size: var(--rumo-text-caption-size); line-height: var(--rumo-text-caption-lh); font-weight: var(--rumo-text-caption-weight); color: var(--rumo-c-neutral-500);">Caption 12 说明文字</div>
  <div style="font-size: var(--rumo-text-label-size); line-height: var(--rumo-text-label-lh); font-weight: var(--rumo-text-label-weight); letter-spacing: var(--rumo-text-label-ls); color: var(--rumo-c-neutral-500);">LABEL 11 标签</div>
</div>
```
:::

### 令牌清单

| 令牌 | 说明 |
| --- | --- |
| `--rumo-c-ink` / `--rumo-c-paper` | 前景 / 背景基色,暗色自动互换 |
| `--rumo-c-neutral-50` … `950` | 中性灰 11 级(轻微紫色相) |
| `--rumo-c-accent` 及 `-dark` / `-light` / `50` … `950` | 强调色,主值 `#856AF9` |
| `--rumo-c-amber` 及 `-dark` / `-light` | 辅助强调色 |
| `--rumo-c-success` / `--rumo-c-warning` / `--rumo-c-danger` / `--rumo-c-info` | 语义色 |
| `--rumo-c-series-1` … `8` | 通用分类色板 |
| `--rumo-font-sans` / `--rumo-font-mono` | 字族栈 |
| `--rumo-text-*` | 字阶(`-size` / `-lh` / `-weight` / `-ls`) |
| `--rumo-radius-*` | 圆角 `sm` / `md` / `lg` / `xl` / `full` |
| `--rumo-shadow-*` | 阴影 `sm` / `base` / `md` / `lg` |
| `--rumo-space-*` | 间距刻度 0–20 |
| `--rumo-motion-*` | 动效时长 `fast` / `base` / `slow` 与缓动 `ease` |
| `--rumo-bp-tall` / `--rumo-bp-xtall` | 竖向断点(min-height 900px / 1000px) |

### 用法约定

- CSS 变量只在 `.rumo-dash` 容器内有效;看板类组件由文档示例统一包一层 `class="rumo-dash"`。
- 组件样式编译期引用 SCSS 变量 `$--dash-*`(同名映射,来自 `common/tokens-dash.scss`);运行时换肤用 `--rumo-*`。
- 暗色由容器类 `.rumo-dash.is-dark` 驱动,不引入全局 `:root` 覆盖。
- 旧引擎(Chromium < 111)自动回落 sRGB hex;支持 OKLCH 的引擎在 `@supports` 门控内使用感知均匀色值。
