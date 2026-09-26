[toc]

## InputNumber 计数器

仅允许输入标准的数字值，可定义范围

### 基础用法

:::demo 要使用它，只需要在`rumo-input-number`元素中使用`v-model`绑定变量即可，变量的初始值即为默认值。
```html
<template>
  <rumo-input-number v-model="num1" ref="input" @change="handleChange1" :min="1" :max="10" label="描述文字"></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num1: 1
      };
    },
    methods: {
      handleChange1(value) {
        this.$nextTick(() => {
          // this.num1 = Math.floor(value);
          this.$refs.input.setCurrentValue(Math['floor'](value));
        })
      }
    }
  };
</script>
```
:::

### 取整
`integer` 支持 `true(floor)`、`false`、`floor`、`ceil`、 `round`，默认为 `false`

:::demo `integer`属性接受一个`Boolean/String`。

```html
<template>
  <rumo-input-number v-model="num8" integer="round" @change="handleChange" :min="1" :max="10" label="描述文字"></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num8: 1
      }
    },
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  };
</script>
```
:::

### 禁用状态

:::demo `disabled`属性接受一个`Boolean`，设置为`true`即可禁用整个组件，如果你只需要控制数值在某一范围内，可以设置`min`属性和`max`属性，不设置`min`和`max`时，最小值为 0。

```html
<template>
  <rumo-input-number v-model="num2" :disabled="true"></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num2: 1
      }
    }
  };
</script>
```
:::

### 步数

允许定义递增递减的步数控制

:::demo 设置`step`属性可以控制步长，接受一个`Number`。

```html
<template>
  <rumo-input-number v-model="num3" :step="2"></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num3: 5
      }
    }
  };
</script>
```
:::

### 严格步数

:::demo `step-strictly`属性接受一个`Boolean`。如果这个属性被设置为`true`，则只能输入步数的倍数。

```html
<template>
  <rumo-input-number v-model="num" :step="2" step-strictly></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num: 2
      }
    }
  };
</script>
```
:::

### 精度

:::demo 设置 `precision` 属性可以控制数值精度，接收一个 `Number`。

```html
<template>
  <rumo-input-number v-model="num0" :precision="2" :step="0.1" :max="10"></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num0: 1
      }
    }
  };
</script>
```

:::

:::tip
`precision` 的值必须是一个非负整数，并且不能小于 `step` 的小数位数。
:::

### 尺寸

额外提供了 `large`、`medium`、`small`、`mini` 四种尺寸的数字输入框

:::demo

```html
<template>
<div>
  <rumo-input-number size="large" v-model="num5"></rumo-input-number>
</div>
<div style="margin-top: 20px">
  <rumo-input-number size="medium" v-model="num5"></rumo-input-number>
</div>
<div style="margin-top: 20px">
  <rumo-input-number v-model="num4"></rumo-input-number>
</div>
<div style="margin-top: 20px">
  <rumo-input-number size="small" v-model="num6"></rumo-input-number>
</div>
<div style="margin-top: 20px">
  <rumo-input-number size="mini" v-model="num7"></rumo-input-number>
</div>
</template>
<script>
  export default {
    data() {
      return {
        num4: 1,
        num5: 1,
        num6: 1,
        num7: 1
      }
    }
  };
</script>
```
:::

### 按钮位置

:::demo 设置 `controls-position` 属性可以控制按钮位置。
```html
<template>
  <rumo-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></rumo-input-number>
</template>
<script>
  export default {
    data() {
      return {
        num8: 1
      };
    },
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  };
</script>
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|----------|-------------- |----------|--------------------------------  |-------- |
| value    | 绑定值         | number | — | — |
| min      | 设置计数器允许的最小值 | number | — | 0 |
| max      | 设置计数器允许的最大值 | number | — | Infinity |
| step     | 计数器步长           | number   | — | 1 |
| step-strictly | 是否只能输入 step 的倍数 | number   | — | false |
| precision| 数值精度             | number   | — | — |
| size     | 计数器尺寸           | string   | large, small | — |
| disabled | 是否禁用计数器        | boolean | — | false |
| controls | 是否使用控制按钮        | boolean | — | true |
| controls-position | 控制按钮位置 | string | right | - |
| name | 原生属性 | string | — | — |
| label | 输入框关联的label文字 | string | — | — |
| integer | 计数器取整 | boolean/string | true, false, floor, ceil, round | false |
| placeholder | 输入框默认 placeholder | string | - | - |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| change | 绑定值被改变时触发 | 最后变更的值 |
| blur | 在组件 Input 失去焦点时触发 | (event: Event) |
| focus | 在组件 Input 获得焦点时触发 | (event: Event) |

### Methods
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| focus | 使 input 获取焦点 | - |
| select | 选中 input 中的文字 | — |
