## Typography 字体

我们对字体进行统一规范，力求在各个操作系统下都有最佳展示效果。

### 中文字体
:::demo
```html

<div class="demo-typo-box typo-PingFang">
  某某科技
  <div class="name">PingFang SC</div>
</div>
<div class="demo-typo-box typo-Hiragino">
  某某科技
  <div class="name">Hiragino Sans GB</div>
</div>
<div class="demo-typo-box typo-Microsoft">
  某某科技
  <div class="name">Microsoft YaHei</div>
</div>
```
:::

### 英文／数字字体
:::demo
```html
<div class="demo-typo-box demo-en typo-Segoe-UI">
  Rumo Design
  <div class="name">Segoe UI</div>
</div>
<div class="demo-typo-box demo-en typo-Roboto">
  Rumo Design
  <div class="name">Roboto</div>
</div>
<div class="demo-typo-box demo-en typo-Helvetica-neue">
  Rumo Design
  <div class="name">Helvetica Neue</div>
</div>
```
:::

### Font-family 代码
:::demo
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
```
:::

### 字号规范
:::demo
```html
<table class="demo-typo-size">
  <tbody>
    <tr>
      <td class="desc">文案</td>
      <td class="desc">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">20px  Extra large</td>
    </tr>
    <tr>
      <td class="h1">主标题</td>
      <td class="h1">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">18px  Extra large</td>
    </tr>
    <tr>
      <td class="h2">标题</td>
      <td class="h2">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">16px large</td>
    </tr>
    <tr>
      <td class="h3">小标题</td>
      <td class="h3">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">14px Medium</td>
    </tr>
    <tr>
      <td class="text-regular">正文</td>
      <td class="text-regular">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">14px Small</td>
      </tr>
    <tr>
      <td class="text-small">正文（小）</td>
      <td class="text-small">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">13px Extra Small</td>
    </tr>
    <tr>
      <td class="text-smaller">辅助文字</td>
      <td class="text-smaller">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">12px Extra Extra Small</td>
    </tr>
  </tbody>
</table>
```
:::
### 色号规范
:::demo
```html
<table class="demo-typo-color">
  <tbody>
    <tr>
      <td>强调文字</td>
      <td class="color-accent">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#0A1D33</td>
    </tr>
    <tr>
      <td>主标题</td>
      <td class="color-h1">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#1F2935</td>
    </tr>
    <tr>
      <td>小标题/正文</td>
      <td class="color-h3">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#525b69</td>
    </tr>
    <tr>
      <td>链接文字</td>
      <td class="color-link">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#008CEE</td>
    </tr>
    <tr>
      <td>告警文字</td>
      <td class="color-warning">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#DC4C4C</td>
    </tr>
    <tr>
      <td>辅助文字</td>
      <td class="color-smaller">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#929BA5</td>
    </tr>
    <tr>
      <td>禁用</td>
      <td class="color-disabled">用 Rumo UI 快速搭建页面</td>
      <td class="color-dark-light">#C3CAD2</td>
    </tr>
  </tbody>
</table>
```
:::
:::tip
若为深色背景，则标准色 (#0A1D33) 改为白色#FFFFFF。
:::
