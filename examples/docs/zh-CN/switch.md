[toc]

## Switch 开关

表示两种相互对立的状态间的切换，多用于触发「开/关」。

### 基本用法

:::demo 绑定`v-model`到一个`Boolean`类型的变量。

```html

<rumo-radio-group v-model="size" style="margin-bottom:5px;" size="mini">
  <rumo-radio-button label="large">大型</rumo-radio-button>
  <rumo-radio-button label="medium">中型</rumo-radio-button>
  <rumo-radio-button label="">默认</rumo-radio-button>
  <rumo-radio-button label="small">小型</rumo-radio-button>
  <rumo-radio-button label="mini">迷你</rumo-radio-button>
</rumo-radio-group>

<rumo-switch
  v-model="value2"
  :size="size">
</rumo-switch>

<script>
  export default {
    data() {
      return {
        size: '',
        value1: true,
        value2: true
      }
    }
  };
</script>
```
:::

### 文字描述

:::demo 使用`active-text`属性与`inactive-text`属性来设置开关的文字描述，`in-label`属性控制提示文字是否在label显示，默认`false`，可以使用`active-color`属性与`inactive-color`属性来设置开关的背景色。。

```html
<div style="margin-bottom: 5px;">
  显示位置：
  <rumo-radio-group v-model="inLabel" size="mini">
    <rumo-radio-button :label="true">True</rumo-radio-button>
    <rumo-radio-button :label="false">False</rumo-radio-button>
  </rumo-radio-group>
</div>

<rumo-switch
  v-model="value3"
  :size="size"
  :in-label="inLabel"
  active-text="按月付费"
  inactive-text="按年付费">
</rumo-switch>
<rumo-switch
  style="display: block"
  v-model="value4"
  :size="size"
  :in-label="inLabel"
  active-color="#13ce66"
  inactive-color="#ff4949"
  active-text="按月付费"
  inactive-text="按年付费">
</rumo-switch>

<script>
  export default {
    data() {
      return {
        size: '',
        inLabel: false,
        value3: true,
        value4: true
      }
    }
  };
</script>
```
:::

### 扩展的 value 类型

:::demo 设置`active-value`和`inactive-value`属性，接受`Boolean`, `String`或`Number`类型的值。

```html
<rumo-tooltip :content="'Switch value: ' + value5" placement="top">
  <rumo-switch
    v-model="value5"
    active-color="#13ce66"
    inactive-color="#ff4949"
    active-value="100"
    inactive-value="0">
  </rumo-switch>
</rumo-tooltip>

<script>
  export default {
    data() {
      return {
        value5: '100'
      }
    }
  };
</script>
```

:::

### 禁用状态

:::demo 设置`disabled`属性，接受一个`Boolean`，设置`true`即可禁用。


```html
<rumo-switch
  v-model="value6"
  disabled>
</rumo-switch>
<rumo-switch
  v-model="value7"
  disabled>
</rumo-switch>
<script>
  export default {
    data() {
      return {
        value6: true,
        value7: false
      }
    }
  };
</script>
```
:::


### Attributes

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| value / v-model | 绑定值 | boolean / string / number | — | — |
| disabled  | 是否禁用    | boolean   | — | false   |
| width  | switch 的宽度（像素）    | number   | — | 40 |
| size  | switch 尺寸 | string | large / medium / small / mini | - |
| active-icon-class  | switch 打开时所显示图标的类名，设置此项会忽略 `active-text`    | string   | — | — |
| inactive-icon-class  | switch 关闭时所显示图标的类名，设置此项会忽略 `inactive-text`    | string   | — | — |
| in-label  | 文字描述在label显示，否则在inner    | boolean   | — | false |
| active-text  | switch 打开时的文字描述    | string   | — | — |
| inactive-text  | switch 关闭时的文字描述    | string   | — | — |
| active-value  | switch 打开时的值    | boolean / string / number | — | true |
| inactive-value  | switch 关闭时的值    | boolean / string / number | — | false |
| active-color  | switch 打开时的背景色    | string   | — | #409EFF |
| inactive-color  | switch 关闭时的背景色    | string   | — | #C0CCDA |
| name  | switch 对应的 name 属性    | string   | — | — |
| validate-event  | 改变 switch 状态时是否触发表单的校验     | boolean   | - | true |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | switch 状态发生变化时的回调函数    | 新状态的值 |

### Methods
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| focus | 使 Switch 获取焦点 | - |
