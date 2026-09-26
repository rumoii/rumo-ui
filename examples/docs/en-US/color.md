[toc]

## Color 色彩

RumoUI 为了避免视觉传达差异，使用一套特定的调色板来规定颜色，为你所搭建的产品提供一致的外观视觉感受。

### 主色

RumoUI 主要品牌颜色是鲜艳、友好的蓝色。
:::demo
```html
<rumo-row :gutter="12">
  <rumo-col :span="6">
    <div class="demo-color-box bg-blue">Blue<div class="value">#008CEE</div></div>
  </rumo-col>
</rumo-row>
```
:::

### 辅助色

除了主色外的场景色，需要在不同的场景中使用（例如危险色表示危险的操作）。
:::demo
```html
<rumo-row :gutter="12">
  <rumo-col :span="6">
    <div class="demo-color-box bg-success">Success<div class="value">#4BAB4E</div></div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box bg-warning">Warning<div class="value">#F58032</div></div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box bg-danger">Danger<div class="value">#E3614A</div></div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box bg-default">Default<div class="value">#9FA5AD</div></div>
  </rumo-col>
</rumo-row>
```
:::

### 中性色

中性色用于文本、背景和边框颜色。通过运用不同的中性色，来表现层次结构。
:::demo
```html
<rumo-row :gutter="12">
  <rumo-col :span="6">
    <div class="demo-color-box-group">
      <div class="demo-color-box bg-text-primary">主要文字<div class="value">#0A1D33</div></div>
      <div class="demo-color-box bg-text-regular">常规文字<div class="value">#525B69</div></div>
      <div class="demo-color-box bg-text-secondary">次要文字<div class="value">#929BA5</div></div>
      <div class="demo-color-box bg-text-placeholder">占位文字<div class="value">#C3CAD2</div></div>
    </div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box-group">
      <div class="demo-color-box bg-border-base">一级边框<div class="value">#DCDFE6</div></div>
      <div class="demo-color-box bg-border-light">二级边框<div class="value">#E4E7ED</div></div>
      <div class="demo-color-box bg-border-lighter">三级边框<div class="value">#EBEEF5</div></div>
      <div class="demo-color-box bg-border-extra-light">四级边框<div class="value">#F2F6FC</div></div>
    </div>
  </rumo-col>
</rumo-row>
```
:::