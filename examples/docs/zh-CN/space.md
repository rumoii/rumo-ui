## Space 间距

用于设置组件之间的间距,支持水平/垂直方向、自定义尺寸、自动换行与填充布局。

### 基础用法

相邻组件之间的水平间距,预设尺寸 `small`。

:::demo

```html
<rumo-space>
  <rumo-button>按钮一</rumo-button>
  <rumo-button>按钮二</rumo-button>
  <rumo-button>按钮三</rumo-button>
</rumo-space>
```

:::

### 垂直方向

通过 `direction` 设置排列方向。

:::demo

```html
<rumo-space direction="vertical">
  <rumo-button>按钮一</rumo-button>
  <rumo-button>按钮二</rumo-button>
  <rumo-button>按钮三</rumo-button>
</rumo-space>
```

:::

### 自定义尺寸

`size` 支持预设 `small` / `default` / `large`,或传入数字(px),或 `[水平, 垂直]` 数组。

:::demo

```html
<rumo-space :size="32">
  <rumo-button>32px 间距</rumo-button>
  <rumo-button>32px 间距</rumo-button>
</rumo-space>
```

:::

### 自动换行

`wrap` 开启后空间不足时自动换行。

:::demo

```html
<rumo-space wrap :size="[16, 16]" style="width: 300px">
  <rumo-button v-for="i in 8" :key="i">按钮 {{ i }}</rumo-button>
</rumo-space>
```

:::

### 填充容器

`fill` 让子项拉伸填满容器,`fillRatio` 控制单项最小宽度占比。

:::demo

```html
<rumo-space fill style="width: 480px">
  <rumo-button style="width: 120px">固定宽</rumo-button>
  <rumo-button>自适应</rumo-button>
  <rumo-button>自适应</rumo-button>
</rumo-space>
```

:::

### 分隔符

使用 `spacer` 属性或同名插槽在相邻项之间插入分隔内容。

:::demo

```html
<rumo-space spacer="|">
  <span>首页</span>
  <span>列表</span>
  <span>详情</span>
</rumo-space>
```

:::

### Space Attributes

| 参数      | 说明                                     | 类型                         | 可选值                            | 默认值       |
| --------- | ---------------------------------------- | ---------------------------- | --------------------------------- | ------------ |
| direction | 排列方向                                 | string                       | horizontal / vertical             | horizontal   |
| alignment | 对齐方式(align-items)                    | string                       | flex-start / center / flex-end 等 | center       |
| size      | 间距大小;数组为 `[水平, 垂直]`           | string / number / number[]   | small / default / large / number  | small        |
| spacer    | 相邻项之间的分隔内容                     | string / number              | —                                 | —            |
| wrap      | 空间不足时自动换行                       | boolean                      | —                                 | false        |
| fill      | 子项是否拉伸填满容器                     | boolean                      | —                                 | false        |
| fillRatio | fill 时单项最小宽度占比(%)              | number                       | —                                 | 100          |
| prefixCls | 子项类名前缀(默认 `rumo-space`)         | string                       | —                                 | —            |

### Slots

| 名称    | 说明               |
| ------- | ------------------ |
| default | 需要设置间距的子项 |
| spacer  | 自定义分隔内容     |
