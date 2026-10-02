[toc]

## Button 按钮
常用的操作按钮。

### 基础用法

基础的按钮用法。

:::demo 使用`type`、`plain`、`round`和`circle`属性来定义 Button 的样式。

```html
<rumo-radio-group v-model="size" style="margin-bottom:10px;" size="mini">
  <rumo-radio-button label="large">大型</rumo-radio-button>
  <rumo-radio-button label="medium">中型</rumo-radio-button>
  <rumo-radio-button label="">默认</rumo-radio-button>
  <rumo-radio-button label="small">小型</rumo-radio-button>
  <rumo-radio-button label="mini">迷你</rumo-radio-button>
</rumo-radio-group>

<rumo-row>
  <rumo-button class="is-remind" type="primary" :size="size">主要按钮</rumo-button>
  <rumo-button type="primary" plain :size="size">朴素按钮</rumo-button>
  <rumo-button :size="size" plain>默认按钮</rumo-button>
  <rumo-button dashed :size="size">虚线按钮</rumo-button>
  <rumo-button type="danger" plain :size="size">警示按钮</rumo-button>
</rumo-row>

<rumo-row>
  <rumo-button type="primary" round :size="size">圆角按钮</rumo-button>
  <rumo-button type="primary" round plain :size="size">朴素按钮</rumo-button>
  <rumo-button round :size="size" plain>默认按钮</rumo-button>
  <rumo-button round dashed :size="size">虚线按钮</rumo-button>
  <rumo-button type="danger" round plain :size="size">警示按钮</rumo-button>
</rumo-row>

<rumo-row>
  <rumo-tooltip class="item" content="圆形按钮" placement="top">
    <rumo-button type="primary" icon="icon-question" circle :size="size">圆形按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="朴素按钮" placement="top">
     <rumo-button type="primary" icon="icon-question" circle plain :size="size">正圆形按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="默认按钮" placement="top">
    <rumo-button icon="icon-question" circle :size="size" plain>正圆形按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="虚线按钮" placement="top">
    <rumo-button icon="icon-question" circle dashed :size="size">正圆形按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="警示按钮" placement="top">
    <rumo-button type="danger" icon="icon-question" circle round plain :size="size"></rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="仅有图标按钮" placement="top">
    <rumo-button type="primary" icon="icon-question" :size="size"></rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="朴素按钮" placement="top">
    <rumo-button type="primary" icon="icon-question" plain :size="size"></rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="默认按钮" placement="top">
    <rumo-button icon="icon-question" :size="size" plain></rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="虚线按钮" placement="top">
    <rumo-button icon="icon-question" dashed :size="size"></rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="警示按钮" placement="top">
    <rumo-button type="danger" icon="icon-question" plain :size="size"></rumo-button>
  </rumo-tooltip>
  <rumo-button text :size="size">文字按钮</rumo-button>
</rumo-row>
<script>
  export default {
    data() {
      return {
         size: ''
      };
    }
  }
</script>
```
:::

### 状态

:::demo
```html
<table class="table-button">
  <tr>
    <td></td>
    <td>主要按钮</td>
    <td>次按钮</td>
    <td>信息按钮</td>
    <td>文字按钮</td>
    <td>图标按钮</td>
  </tr>
  <tr>
    <td>常规状态</td>
    <td><rumo-button type="primary">button</rumo-button><p>#0091ff</p></td>
    <td><rumo-button plain>button</rumo-button><p>#55677d</p></td>
    <td><rumo-button type="primary" plain>button</rumo-button><p>随需求改变颜色</p></td>
    <td><rumo-button text type="primary">button</rumo-button><p>#0091ff</p></td>
    <td><rumo-button icon="icon-search" nobord></rumo-button><p>#c3cbd6</p></td>
  </tr>
  <tr class="hover-state">
    <td>悬停状态</td>
    <td><button class="first" disabled>button</button><p>#0091ff+10%白</p></td>
    <td><button class="second" disabled>button</button><p>#0091ff+10%白</p></td>
    <td><button class="third" disabled>button</button><p>随需求改变颜色</p></td>
    <td><button class="forth" disabled>button</button><p>#0091ff+10%白</p></td>
    <td class="icon"><rumo-icon name="search"></rumo-icon><p>#0091ff+10%白</p></td>
  </tr>
  <tr class="click-state">
    <td>点击状态</td>
    <td><button class="first" disabled>button</button><p>#0091ff+10%黑</p></td>
    <td><button class="second" disabled>button</button><p>#0091ff+10%黑</p></td>
    <td><button class="third" disabled>button</button><p>颜色+10%黑</p></td>
    <td><button class="forth" disabled>button</button><p>#0091ff+10%黑</p></td>
    <td class="icon"><rumo-icon name="search" size="14"></rumo-icon><p>#0091ff+10%黑</p></td>
  </tr>
  <tr class="double-line">
    <td>不可交互状态</td>
    <td><rumo-button type="primary" disabled>button</rumo-button><p>#c3cbd6(文)<br>#f6f7f9(底)</p></td>
    <td><rumo-button disabled>button</rumo-button><p>#c3cbd6(文)<br>#e9edf2(框)</p></td>
    <td><rumo-button type="danger" plain disabled>button</rumo-button><p>#c3cbd6(文)<br>#e9edf2(框)</p></td>
    <td><rumo-button text type="primary" disabled>button</rumo-button><p>#c3cbd6</p></td>
    <td><rumo-button icon="icon-search" nobord disabled></rumo-button><p>#e9edf2</p></td>
  </tr>
</table>
```
:::

### 禁用状态

按钮不可用状态。

:::demo 你可以使用`disabled`属性来定义按钮是否可用，它接受一个`Boolean`值。

```html
<rumo-row>
  <rumo-button disabled>禁止按钮</rumo-button>
  <rumo-button round disabled>禁止按钮</rumo-button>
  <rumo-button circle disabled>正圆形按钮</rumo-button>
  <rumo-button icon="icon-question" disabled></rumo-button>
  <rumo-button type="primary" text disabled>文字按钮</rumo-button>
  <rumo-button type="success" text disabled>文字按钮</rumo-button>
  <rumo-button type="warning" text disabled>文字按钮</rumo-button>
  <rumo-button type="danger" text disabled>文字按钮</rumo-button>
  <rumo-button type="info" text disabled>文字按钮</rumo-button>
  <!-- <rumo-button text disabled>文字按钮</rumo-button> -->
</rumo-row>
<rumo-row>
  <rumo-button disabled>默认按钮</rumo-button>
  <rumo-button type="primary" disabled>主要按钮</rumo-button>
  <rumo-button type="success" disabled>成功按钮</rumo-button>
  <rumo-button type="warning" disabled>警告按钮</rumo-button>
  <rumo-button type="danger" disabled>危险按钮</rumo-button>
  <rumo-button type="info" disabled>信息按钮</rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button plain disabled>朴素按钮</rumo-button>
  <rumo-button type="primary" plain disabled>主要按钮</rumo-button>
  <rumo-button type="success" plain disabled>成功按钮</rumo-button>
  <rumo-button type="warning" plain disabled>警告按钮</rumo-button>
  <rumo-button type="danger" plain disabled>危险按钮</rumo-button>
  <rumo-button type="info" plain disabled>信息按钮</rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button dashed disabled>虚线按钮</rumo-button>
  <rumo-button type="primary" dashed disabled>主要按钮</rumo-button>
  <rumo-button type="success" dashed disabled>成功按钮</rumo-button>
  <rumo-button type="warning" dashed disabled>警告按钮</rumo-button>
  <rumo-button type="danger" dashed disabled>危险按钮</rumo-button>
  <rumo-button type="info" dashed disabled>信息按钮</rumo-button>
</rumo-row>

```
:::

### 文字按钮

没有边框和背景色的按钮。

:::demo
```html
  <rumo-button text>文字按钮</rumo-button>
  <rumo-button type="info" text>文字按钮</rumo-button>
  <!-- <rumo-button type="primary" text>文字按钮</rumo-button>
  <rumo-button type="success" text>文字按钮</rumo-button>
  <rumo-button type="warning" text>文字按钮</rumo-button>
  <rumo-button type="danger" text>文字按钮</rumo-button>
  <rumo-button type="info" text>文字按钮</rumo-button> -->
```
:::

### 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置`icon`属性即可，icon 的列表可以参考 Rumo UI 的 icon 组件，也可以设置在文字右边的 icon ，只要使用`i`标签即可，可以使用自定义图标。

```html
<rumo-row>
  <rumo-button type="primary" icon="icon-edit"></rumo-button>
  <rumo-button type="primary" icon="icon-return-bottom"></rumo-button>
  <rumo-button type="primary" icon="icon-point-arrow"></rumo-button>
  <rumo-button type="primary" icon="icon-search">搜索</rumo-button>
  <rumo-button type="primary" icon="icon-search" circle>搜索</rumo-button>
  <rumo-button type="primary">上传 <i class="rumo-icons icon-upload"></i></rumo-button>
  <rumo-button text icon="icon-down-line">高级</rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button icon="icon-edit"></rumo-button>
  <rumo-button icon="icon-return-bottom"></rumo-button>
  <rumo-button icon="icon-point-arrow"></rumo-button>
  <rumo-button icon="icon-search">搜索</rumo-button>
  <rumo-button icon="icon-search" circle>搜索</rumo-button>
  <rumo-button>上传 <i class="rumo-icons icon-upload"></i></rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button icon="icon-edit" disabled></rumo-button>
  <rumo-button icon="icon-return-bottom" disabled></rumo-button>
  <rumo-button icon="icon-point-arrow" disabled></rumo-button>
  <rumo-button icon="icon-search" disabled>搜索</rumo-button>
  <rumo-button icon="icon-search" circle disabled>搜索</rumo-button>
  <rumo-button disabled>上传 <i class="rumo-icons icon-upload"></i></rumo-button>
  <rumo-button text icon="icon-down-line" disabled>高级</rumo-button>
</rumo-row>
```
:::

### 按钮组

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用`<rumo-button-group>`标签来嵌套你的按钮。

```html
<rumo-row>
  <rumo-button-group>
    <rumo-button type="primary" icon="icon-arrow-left">上一页</rumo-button>
    <rumo-button type="primary">下一页 <i class="rumo-icons icon-arrow-right"></i></rumo-button>
  </rumo-button-group>
  <rumo-button-group>
    <rumo-button type="primary" icon="icon-edit"></rumo-button>
    <rumo-button type="primary" icon="icon-refresh"></rumo-button>
    <rumo-tooltip class="item" content="设置" placement="top">
      <rumo-button type="primary" icon="icon-cog"></rumo-button>
    </rumo-tooltip>
  </rumo-button-group>

  <rumo-button-group>
    <rumo-button type="primary" icon="icon-arrow-left" plain>上一页</rumo-button>
    <rumo-button type="primary" plain>下一页 <i class="rumo-icons icon-arrow-right"></i></rumo-button>
  </rumo-button-group>
  <rumo-button-group>
    <rumo-button type="primary" icon="icon-edit" plain></rumo-button>
    <rumo-button type="primary" icon="icon-refresh" plain></rumo-button>
    <rumo-button type="primary" icon="icon-cog" plain></rumo-button>
    <!-- <rumo-tooltip class="rumo-button item upload-button-demo" content="上传" placement="top">
      <rumo-upload
        class="upload-demo"
        button="primary"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :show-file-list="false"
        :limit="3">
         <rumo-button>上传 <i class="rumo-icons icon-upload"></i></rumo-button>
      </rumo-upload>
    </rumo-tooltip> -->
  </rumo-button-group>
</rumo-row>
<rumo-row>
  <rumo-button-group>
    <rumo-button icon="icon-arrow-left">上一页</rumo-button>
    <rumo-button >下一页 <i class="rumo-icons icon-arrow-right"></i></rumo-button>
  </rumo-button-group>
  <rumo-button-group>
    <rumo-button icon="icon-edit"></rumo-button>
    <rumo-button icon="icon-refresh"></rumo-button>
    <rumo-button icon="icon-cog"></rumo-button>
  </rumo-button-group>

  <rumo-button-group>
    <rumo-button icon="icon-arrow-left" disabled>上一页</rumo-button>
    <rumo-button disabled>下一页 <i class="rumo-icons icon-arrow-right"></i></rumo-button>
  </rumo-button-group>
  <rumo-button-group>
    <rumo-button icon="icon-edit" disabled></rumo-button>
    <rumo-button icon="icon-refresh" disabled></rumo-button>
    <rumo-button icon="icon-cog" disabled></rumo-button>
  </rumo-button-group>
</rumo-row>
```
:::

### 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置`loading`属性为`true`即可。

```html
<rumo-button type="primary" :loading="true" size="medium">加载中</rumo-button>
```
:::

### 不同颜色

不同颜色按钮的应用场景 。

:::demo 应用场景:`不同颜色按钮的应用场景：primary`、`success`、`warning`、`info`，通过设置`type`属性来配置它们。

```html
<rumo-row>
  <rumo-button >默认按钮</rumo-button>
  <rumo-button round >圆角按钮</rumo-button>
  <rumo-button circle >正圆形按钮</rumo-button>
  <rumo-button icon="icon-question" size="medium"></rumo-button>
  <rumo-button type="primary" text >文字按钮</rumo-button>
  <rumo-button type="success" text >文字按钮</rumo-button>
  <rumo-button type="warning" text >文字按钮</rumo-button>
  <rumo-button type="danger" text >文字按钮</rumo-button>
  <rumo-button type="info" text >文字按钮</rumo-button>
  <!-- <rumo-button text >文字按钮</rumo-button> -->
</rumo-row>
<rumo-row>
  <rumo-button >默认按钮</rumo-button>
  <rumo-button type="primary" >主要按钮</rumo-button>
  <rumo-button type="success" >成功按钮</rumo-button>
  <rumo-button type="warning" >警告按钮</rumo-button>
  <rumo-button type="danger" >危险按钮</rumo-button>
  <rumo-button type="info" >信息按钮</rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button plain >朴素按钮</rumo-button>
  <rumo-button type="primary" plain >主要按钮</rumo-button>
  <rumo-button type="success" plain >成功按钮</rumo-button>
  <rumo-button type="warning" plain >警告按钮</rumo-button>
  <rumo-button type="danger" plain >危险按钮</rumo-button>
  <rumo-button type="info" plain >信息按钮</rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button dashed >虚线按钮</rumo-button>
  <rumo-button type="primary" dashed >主要按钮</rumo-button>
  <rumo-button type="success" dashed >成功按钮</rumo-button>
  <rumo-button type="warning" dashed >警告按钮</rumo-button>
  <rumo-button type="danger" dashed >危险按钮</rumo-button>
  <rumo-button type="info" dashed >信息按钮</rumo-button>
</rumo-row>
```
:::

### 不同尺寸

Button 组件提供除了默认值以外的五种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`large`、`medium`、`small`、`mini`，通过设置`size`属性来配置它们。
```html
<rumo-row>
  <rumo-button size="large">大型</rumo-button>
  <rumo-button size="medium">中等</rumo-button>
  <rumo-button>默认</rumo-button>
  <rumo-button size="small">小型</rumo-button>
  <rumo-button size="mini">超小</rumo-button>
</rumo-row>
<rumo-row>
  <rumo-button size="large" icon="icon-appreciate"></rumo-button>
  <rumo-button size="medium" icon="icon-appreciate"></rumo-button>
  <rumo-button icon="icon-appreciate"></rumo-button>
  <rumo-button size="small" icon="icon-appreciate"></rumo-button>
  <rumo-button size="mini" icon="icon-appreciate"></rumo-button>
</rumo-row>
<rumo-row>
  <rumo-tooltip class="item" content="大型按钮" placement="top">
    <rumo-button size="large" circle>大型按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="中型按钮" placement="top">
    <rumo-button size="medium" circle>中型按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="默认按钮" placement="top">
    <rumo-button circle>默认按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="小型按钮" placement="top">
    <rumo-button size="small" circle>小型按钮</rumo-button>
  </rumo-tooltip>
  <rumo-tooltip class="item" content="超小按钮" placement="top">
    <rumo-button size="mini" circle>超小按钮</rumo-button>
  </rumo-tooltip>
</rumo-row>
<rumo-row>
  <rumo-button size="large" text>编辑</rumo-button>
  <rumo-button size="medium" text>新增</rumo-button>
  <rumo-button text>成功</rumo-button>
  <rumo-button size="small" text>错误</rumo-button>
  <rumo-button size="mini" text>输出</rumo-button>
</rumo-row>
```
:::

### Dash 变体

`variant` 提供看板设计语言的三种视觉:`primary`(近黑白主按钮)、`secondary`(描边按钮,悬停强调色)、`ghost`(透明按钮,悬停强调色)。与 `type` 正交,设置后覆盖基于 `type` 的外观;未设置时按钮行为与外观不变。
:::demo
```html
<div class="rumo-dash">
  <rumo-row>
    <rumo-button variant="primary">主要按钮</rumo-button>
    <rumo-button variant="secondary">次要按钮</rumo-button>
    <rumo-button variant="ghost">幽灵按钮</rumo-button>
  </rumo-row>
  <rumo-row>
    <rumo-button variant="primary" size="large">大号</rumo-button>
    <rumo-button variant="primary">中号</rumo-button>
    <rumo-button variant="primary" size="small">小号</rumo-button>
    <rumo-button variant="primary" size="mini">迷你</rumo-button>
  </rumo-row>
  <rumo-row>
    <rumo-button variant="primary" disabled>禁用</rumo-button>
    <rumo-button variant="secondary" disabled>禁用</rumo-button>
    <rumo-button variant="ghost" disabled>禁用</rumo-button>
    <rumo-button variant="primary" loading>加载中</rumo-button>
  </rumo-row>
</div>
```
:::

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| size     | 尺寸   | string  |   large / medium / small / mini            |    —     |
| type     | 类型   | string    |   primary / success / warning / danger / info  |     —    |
| variant  | Dash 皮肤视觉变体,设置后覆盖 type 外观 | string | primary / secondary / ghost | — |
| text     | 是否文字按钮   | boolean    | — | false   |
| plain     | 是否朴素按钮   | boolean    | — | false   |
| dashed     | 是否虚线按钮   | boolean    | — | false   |
| round     | 是否圆角按钮   | boolean    | — | false   |
| circle     | 是否圆形按钮   | boolean    | — | false   |
| loading     | 是否加载中状态   | boolean    | — | false   |
| disabled  | 是否禁用状态    | boolean   | —   | false   |
| icon  | 图标类名 | string   |  —  |  —  |
| autofocus  | 是否默认聚焦 | boolean   |  —  |  false  |
| native-type | 原生 type 属性 | string | button / submit / reset | button |
