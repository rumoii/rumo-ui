## Segmented 分段控制器

使用 `v-model` 选择一项。支持字符串、数字及带标签的对象选项。

:::demo

```html
<template>
  <rumo-segmented v-model="choice" :options="['日', '周', '月']" />
</template>
<script>
export default { data() { return { choice: '周' }; } };
</script>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value / v-model | 当前值 | string / number / boolean | — |
| options | 选项数组 | array | [] |
| props | 对象选项的 label/value/disabled 字段映射 | object | 同名字段 |
| direction | horizontal / vertical | string | horizontal |
| block | 填满父容器 | boolean | false |
| size | large / medium / small | string | — |
| disabled | 禁用全部选项 | boolean | false |
| validateEvent | 触发表单校验 | boolean | true |
| name | 单选组原生名称 | string | 自动生成 |
| ariaLabel | 无障碍名称 | string | segmented |

### Events / Slots

| 名称 | 说明 |
| --- | --- |
| input | 选中值变化，供 v-model 使用 |
| change | 选中值变化 |
| default | 选项内容，作用域参数 `item` |
