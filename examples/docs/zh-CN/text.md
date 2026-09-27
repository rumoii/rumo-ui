## Text 文本

统一的文本排版组件,支持语义色、尺寸、省略与多行裁剪,省略时自动携带原内容 title 提示。

### 基础用法

:::demo

```html
<rumo-text>默认文本</rumo-text>
```

:::

### 类型

通过 `type` 设置语义颜色。

:::demo

```html
<div>
  <rumo-text type="primary">主要文本</rumo-text>
  <rumo-text type="success">成功文本</rumo-text>
  <rumo-text type="warning">警告文本</rumo-text>
  <rumo-text type="danger">危险文本</rumo-text>
  <rumo-text type="info">信息文本</rumo-text>
</div>
```

:::

### 尺寸

`size` 支持 `large` / `default` / `small`,不传时跟随表单尺寸。

:::demo

```html
<div>
  <rumo-text size="large">大号文本</rumo-text>
  <rumo-text>默认文本</rumo-text>
  <rumo-text size="small">小号文本</rumo-text>
</div>
```

:::

### 省略

`truncated` 单行省略,溢出时 title 显示完整内容。

:::demo

```html
<div style="width: 240px;">
  <rumo-text truncated>
    这是一段很长的文本,超出容器宽度后会显示省略号,鼠标悬停可以看到完整内容。
  </rumo-text>
</div>
```

:::

### 多行裁剪

`line-clamp` 指定最大行数,超出部分裁剪。

:::demo

```html
<div style="width: 240px;">
  <rumo-text :line-clamp="2">
    这是一段很长的文本,会被裁剪到指定的行数。多行裁剪基于 -webkit-line-clamp 实现,溢出时同样自动携带 title 提示。
  </rumo-text>
</div>
```

:::

### Text Attributes

| 参数        | 说明                             | 类型    | 可选值                                   | 默认值 |
| ----------- | -------------------------------- | ------- | ---------------------------------------- | ------ |
| type        | 文本类型                         | string  | primary / success / warning / danger / info | —   |
| size        | 文本尺寸(不传时跟随表单尺寸) | string  | large / default / small                  | —      |
| truncated   | 单行省略                         | boolean | —                                        | false  |
| line-clamp  | 最大行数(多行裁剪)           | number / string | —                               | —      |
| tag         | 自定义元素标签                   | string  | —                                        | span   |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 文本内容 |
