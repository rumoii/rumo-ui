## Segmented

Use `v-model` to select an option. Strings, numbers and option objects are supported.

:::demo

```html
<template>
  <rumo-segmented v-model="choice" :options="['Day', 'Week', 'Month']" />
</template>
<script>
export default { data() { return { choice: 'Week' }; } };
</script>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value / v-model | Selected value | string / number / boolean | — |
| options | Options | array | [] |
| props | Object option field mapping | object | label/value/disabled |
| direction | horizontal / vertical | string | horizontal |
| block | Fill container | boolean | false |
| size | large / medium / small | string | — |
| disabled | Disable all options | boolean | false |
| validateEvent | Trigger form validation | boolean | true |
| name | Native radio group name | string | generated |
| ariaLabel | Accessible label | string | segmented |

### Events / Slots

| Name | Description |
| --- | --- |
| input | Selected value for v-model |
| change | Selected value changed |
| default | Option content; scoped `item` |
