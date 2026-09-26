[toc]

## Color 色彩

RumoUI 为了避免视觉传达差异，使用一套特定的调色板来规定颜色，为你所搭建的产品提供一致的外观视觉感受。

### 主色

用于页面主要配色，按钮和主要信息标识颜色。
:::demo
```html
<rumo-row :gutter="12">
  <rumo-col :span="6">
    <div class="demo-color-box bg-blue">用于导航或特别需要强调的文字、icon以及按钮颜色<div class="value">#0091ff</div></div>
  </rumo-col>
</rumo-row>
```
:::

### 功能色

功能色是具有代表性的颜色，常用于信息提示，比如成功、警告和失败。
:::demo
```html
<rumo-row :gutter="12">
  <rumo-col :span="6">
    <div class="demo-color-box bg-default">
      链接、说明、信息色
      <div class="value">#0091ff</div>
    </div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box bg-success">
      成功色
      <div class="value">#52c41a</div>
    </div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box bg-warning">
      警告色
      <div class="value">#faae14</div>
    </div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box bg-danger">
      失败色
      <div class="value">#f5222d</div>
    </div>
  </rumo-col>
</rumo-row>
```
:::

### 中性色

中性色用于文本、背景和边框颜色。通过运用不同的中性色，来表现层次结构。
:::demo
```html
<rumo-row :gutter="12" class="color-rumo-row">
  <rumo-col :span="6">
    <div class="demo-color-box-group">
      <div class="demo-color-box bg-text-primary">正文内容描述字色<div class="value">#55677d</div></div>
      <div class="demo-color-box bg-text-regular">线框色<div class="value">#d6dae0</div></div>
      <div class="demo-color-box bg-text-secondary">分割线色<div class="value">#edeff3</div></div>
      <div class="demo-color-box bg-text-placeholder">失败背景颜色<div class="value">#f6f7f9</div></div>
    </div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box-group">
      <div class="demo-color-box bg-border-base">一级标题及标题字色<div class="value">#8090A0</div></div>
      <div class="demo-color-box bg-border-light">失效文字<div class="value">#c3cbd6</div></div>
      <div class="demo-color-box bg-border-lighter">点击色<div class="value">#edeff3</div></div>
      <div class="demo-color-box bg-border-extra-light">悬停色<div class="value">#f6f7f9</div></div>
    </div>
  </rumo-col>
  <rumo-col :span="6">
    <div class="demo-color-box-group">
      <div class="demo-color-box bg-border-first">标注文字，辅助文字（输入框提示信息）<div class="value">#9ea7b4</div></div>
      <div class="demo-color-box bg-border-second">失效线框颜色<div class="value">#e9edf2</div></div>
      <div class="demo-color-box bg-border-third">底色<div class="value">#f5f6fa</div></div>
      <div class="demo-color-box bg-border-forth">表单斑马纹色<div class="value">#fafafa</div></div>
    </div>
  </rumo-col>
</rumo-row>
```
:::
