[toc]

## Badge 标记

出现在按钮、图标旁的数字或状态标记。

### 基础用法
展示新消息数量。

:::demo 定义`value`属性，它接受`Number`或者`String`。

```html
<rumo-badge :value="12" class="item">
  <rumo-button size="small">评论</rumo-button>
</rumo-badge>
<rumo-badge :value="3" class="item">
  <rumo-button size="small">回复</rumo-button>
</rumo-badge>
<rumo-badge :value="1" class="item" type="primary">
  <rumo-button size="small">评论</rumo-button>
</rumo-badge>
<rumo-badge :value="2" class="item" type="warning">
  <rumo-button size="small">回复</rumo-button>
</rumo-badge>


<rumo-dropdown trigger="click">
  <span class="rumo-dropdown-link">
    点我查看<i class="rumo-icons icon-down-line rumo-icon--right"></i>
  </span>
  <rumo-dropdown-menu slot="dropdown">
    <rumo-dropdown-item class="clearfix">
      评论
      <rumo-badge class="mark" :value="12" />
    </rumo-dropdown-item>
    <rumo-dropdown-item class="clearfix">
      回复
      <rumo-badge class="mark" :value="3" />
    </rumo-dropdown-item>
  </rumo-dropdown-menu>
</rumo-dropdown>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### 最大值
可自定义最大值。

:::demo 由`max`属性定义，它接受一个`Number`，需要注意的是，只有当`value`为`Number`时，它才会生效。

```html
<rumo-badge :value="200" :max="99" class="item">
  <rumo-button size="small">评论</rumo-button>
</rumo-badge>
<rumo-badge :value="100" :max="10" class="item">
  <rumo-button size="small">回复</rumo-button>
</rumo-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### 自定义内容
可以显示数字以外的文本内容。

:::demo 定义`value`为`String`类型是时可以用于显示自定义文本。

```html
<rumo-badge value="new" class="item">
  <rumo-button size="small">评论</rumo-button>
</rumo-badge>
<rumo-badge value="hot" class="item">
  <rumo-button size="small">回复</rumo-button>
</rumo-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### 小红点
以红点的形式标注需要关注的内容。

:::demo 除了数字外，设置`is-dot`属性，它接受一个`Boolean`。

```html
<rumo-badge is-dot class="item">数据查询</rumo-badge>
<rumo-badge is-dot class="item">
  <rumo-button class="share-button" icon="rumo-icons icon-return-bottom" type="primary"></rumo-button>
</rumo-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Attributes
| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| value          | 显示值      | string, number          |          —             |    —     |
| max          |  最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型    | number  |         —              |     —    |
| is-dot       | 小圆点    | boolean  |  —  |  false |
| hidden | 隐藏 badge | boolean | — | false |
| type         | 类型             | string          | primary / success / warning / danger / info |    —    |
