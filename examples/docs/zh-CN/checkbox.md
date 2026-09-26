[toc]

## Checkbox 多选框
一组备选项中进行多选

### 基础用法

单独使用可以表示两种状态之间的切换，写在标签中的内容为 checkbox 按钮后的介绍。

:::demo 在`rumo-checkbox`元素中定义`v-model`绑定变量，单一的`checkbox`中，默认绑定变量的值会是`Boolean`，选中为`true`。

```html
<template>
  <!-- `checked` 为 true 或 false -->
  <rumo-checkbox v-model="checked">备选项</rumo-checkbox>
</template>
<script>
  export default {
    data() {
      return {
        checked: true
      };
    }
  };
</script>
```
:::

### 禁用状态

多选框不可用状态。

:::demo 设置`disabled`属性即可。

```html
<template>
  <rumo-checkbox v-model="checked1" disabled>备选项1</rumo-checkbox>
  <rumo-checkbox v-model="checked2" disabled>备选项</rumo-checkbox>
</template>
<script>
  export default {
    data() {
      return {
        checked1: false,
        checked2: true
      };
    }
  };
</script>
```
:::

### 多选框组

适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。

:::demo `checkbox-group`元素能把多个 checkbox 管理为一组，只需要在 Group 中使用`v-model`绑定`Array`类型的变量即可。 `rumo-checkbox` 的 `label`属性是该 checkbox 对应的值，若该标签中无内容，则该属性也充当 checkbox 按钮后的介绍。`label`与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中。

```html
<template>
  <rumo-checkbox-group v-model="checkList">
    <rumo-checkbox label="复选框 A"></rumo-checkbox>
    <rumo-checkbox label="复选框 B"></rumo-checkbox>
    <rumo-checkbox label="复选框 C"></rumo-checkbox>
    <rumo-checkbox label="禁用" disabled></rumo-checkbox>
    <rumo-checkbox label="选中且禁用" disabled></rumo-checkbox>
  </rumo-checkbox-group>
</template>

<script>
  export default {
    data () {
      return {
        checkList: ['选中且禁用','复选框 A']
      };
    }
  };
</script>
```
:::

### indeterminate 状态

`indeterminate` 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果

:::demo

```html
<template>
  <rumo-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</rumo-checkbox>
  <div style="margin: 15px 0;"></div>
  <rumo-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
    <rumo-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</rumo-checkbox>
  </rumo-checkbox-group>
</template>
<script>
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
        checkAll: false,
        checkedCities: ['上海', '北京'],
        cities: cityOptions,
        isIndeterminate: true
      };
    },
    methods: {
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    }
  };
</script>
```
:::

### 可选项目数量的限制

使用 `min` 和 `max` 属性能够限制可以被勾选的项目的数量。

:::demo

```html
<template>
  <rumo-checkbox-group 
    v-model="checkedCities1"
    :min="1"
    :max="2">
    <rumo-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</rumo-checkbox>
  </rumo-checkbox-group>
</template>
<script>
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
        checkedCities1: ['上海', '北京'],
        cities: cityOptions
      };
    }
  };
</script>
```

:::

### 按钮样式

按钮样式的多选组合。

:::demo 只需要把`rumo-checkbox`元素替换为`rumo-checkbox-button`RumoUI 还提供了`size`属性。
```html
<template>
  <div>
    <rumo-checkbox-group v-model="checkboxGroup2" size="large">
      <rumo-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</rumo-checkbox-button>
    </rumo-checkbox-group>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox-group v-model="checkboxGroup2" size="medium">
      <rumo-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</rumo-checkbox-button>
    </rumo-checkbox-group>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox-group v-model="checkboxGroup1">
      <rumo-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</rumo-checkbox-button>
    </rumo-checkbox-group>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox-group v-model="checkboxGroup3" size="small">
      <rumo-checkbox-button v-for="city in cities" :label="city" :disabled="city === '北京'" :key="city">{{city}}</rumo-checkbox-button>
    </rumo-checkbox-group>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox-group v-model="checkboxGroup4" size="mini" disabled>
      <rumo-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</rumo-checkbox-button>
    </rumo-checkbox-group>
  </div>
</template>
<script>
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data () {
      return {
        checkboxGroup1: ['上海'],
        checkboxGroup2: ['上海'],
        checkboxGroup3: ['上海'],
        checkboxGroup4: ['上海'],
        cities: cityOptions
      };
    }
  }
</script>
```
:::

### 带有边框

:::demo 设置`border`属性可以渲染为带有边框的多选框。
```html
<template>
  <div>
    <rumo-checkbox v-model="checked7" label="备选项1" border size="large"></rumo-checkbox>
    <rumo-checkbox v-model="checked8" label="备选项2" border size="large"></rumo-checkbox>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox v-model="checked5" label="备选项1" border size="medium"></rumo-checkbox>
    <rumo-checkbox v-model="checked6" label="备选项2" border size="medium"></rumo-checkbox>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox v-model="checked3" label="备选项1" border></rumo-checkbox>
    <rumo-checkbox v-model="checked4" label="备选项2" border></rumo-checkbox>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox-group v-model="checkboxGroup5" size="small">
      <rumo-checkbox label="备选项1" border></rumo-checkbox>
      <rumo-checkbox label="备选项2" border disabled></rumo-checkbox>
    </rumo-checkbox-group>
  </div>
  <div style="margin-top: 20px">
    <rumo-checkbox-group v-model="checkboxGroup6" size="mini" >
      <rumo-checkbox label="备选项1" border></rumo-checkbox>
      <rumo-checkbox label="备选项2" border disabled></rumo-checkbox>
    </rumo-checkbox-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        checked3: true,
        checked4: false,
        checked5: false,
        checked6: true,
        checked7: true,
        checked8: true,
        checkboxGroup5: [],
        checkboxGroup6: []
      };
    }
  }
</script>
```
:::

### 矩形选择框
单独使用可以表示两种状态之间的切换，`label` 为 `rect-checkbox` 的标签名, `value` 为 `rect-checkbox` 的属性值

:::demo 在`rumo-rect-checkbox`元素中定义`v-model`绑定变量，单一的`rect-checkbox`中，默认绑定变量的值会是`Boolean`，选中为`true`。
```html
<template>
  <div>
    <rumo-rect-checkbox
      v-model="isFullChecked"
      label="全屏水印"
      value="full"
      @change="handleChange"
    >
      <img src="examples/assets/images/full-watermark.png" style="width: 160px">
    </rumo-rect-checkbox>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isFullChecked: true,
      }
    },
    methods: {
      handleChange(checked, value) {
        console.log(this.isFullChecked, checked, value)
      }
    }
  }
</script>
```
:::

### 禁用状态

矩形选择框不可用状态。

:::demo 设置`disabled`属性即可。

```html
<template>
  <div>
    <rumo-rect-checkbox
      v-model="isFullChecked"
      label="全屏水印"
      :disabled="true"
    >
      <img src="examples/assets/images/full-watermark.png" style="width: 160px">
    </rumo-rect-checkbox>
    <rumo-rect-checkbox
      v-model="isAreaChecked"
      label="区域水印"
      :disabled="true"
    >
      <img src="examples/assets/images/area-watermark.png" style="width: 160px">
    </rumo-rect-checkbox>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isFullChecked: false,
        isAreaChecked: true
      };
    }
  };
</script>
```
:::

### 多选框组
适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。

:::demo 配合使用`checkbox-group`
```html
<template>
  <div>
    <rumo-checkbox-group v-model="groupList" @change="handleChange">
      <rumo-rect-checkbox
        label="全屏水印"
        value="full"
      >
        <img src="examples/assets/images/full-watermark.png" style="width: 160px">
      </rumo-rect-checkbox>
      <rumo-rect-checkbox
        label="区域水印"
        value="area"
      >
        <img src="examples/assets/images/area-watermark.png" style="width: 160px">
      </rumo-rect-checkbox>
    </rumo-checkbox-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        groupList: ['全屏水印', '区域水印']
      };
    },
    methods: {
      handleChange() {
        console.log(this.groupList)
      }
    }
  }
</script>
```
:::

### Checkbox Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| label     | 选中状态的值（只有在`checkbox-group`或者绑定对象类型为`array`时有效）| string / number / boolean  |       —        |     —    |
| true-label | 选中时的值   | string / number | — |     —    |
| false-label | 没有选中时的值   | string / number    |      —         |     —    |
| disabled  | 是否禁用    | boolean   |  — | false   |
| border  | 是否显示边框  | boolean   | — | false   |
| size  | Checkbox 的尺寸，仅在 border 为真时有效  | string  | large / medium / small / mini | — |
| name | 原生 name 属性 | string    |      —         |     —    |
| checked  | 当前是否勾选    | boolean   |  — | false   |
| indeterminate  | 设置 indeterminate 状态，只负责样式控制    | boolean   |  — | false   |

### Checkbox Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | 当绑定值变化时触发的事件 | 更新后的值 |

### Checkbox-group Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| size     | 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效   | string  | large / medium / small / mini  |    —     |
| disabled  | 是否禁用    | boolean   | — | false   |
| min     | 可被勾选的 checkbox 的最小数量   | number    |       —        |     —    |
| max     | 可被勾选的 checkbox 的最大数量   | number    |       —        |     —    |
| text-color  | 按钮形式的 Checkbox 激活时的文本颜色    | string   | — | #ffffff   |
| fill  | 按钮形式的 Checkbox 激活时的填充色和边框色    | string   | — | #409EFF   |

### Checkbox-group Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | 当绑定值变化时触发的事件 | 更新后的值 |

### Checkbox-button Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| label     | 选中状态的值（只有在`checkbox-group`或者绑定对象类型为`array`时有效）| string / number / boolean  |       —        |     —    |
| true-label | 选中时的值   | string / number | — |     —    |
| false-label | 没有选中时的值   | string / number    |      —         |     —    |
| disabled  | 是否禁用    | boolean   |  — | false   |
| name | 原生 name 属性 | string    |      —         |     —    |
| checked  | 当前是否勾选    | boolean   |  — | false   |

### Rect-Checkbox Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| label     | 标签名   | string |       —        |     —    |
| value     | 属性值   | string / number  | — |     —    |
| disabled  | 是否禁用 | boolean   |  — | false   |
| width     | 边框宽度 | string / number    |      —         |     160    |
| height    | 边框高度 | string / number   |  — | 96   |

### Rect-Checkbox Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | 当绑定值变化时触发的事件 | 更新后的值、对应的属性值 `value` |
