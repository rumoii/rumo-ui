## Statistic 统计数值

展示带分组、精度或自定义格式的数值。

:::demo

```html
<rumo-statistic title="访问次数" :value="12345.67" :precision="2" suffix="次" />
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 数值 | number | 0 |
| precision | 小数位数 | number | 0 |
| decimalSeparator / groupSeparator | 小数 / 千分位分隔符 | string | . / , |
| formatter | 自定义格式函数 | function | — |
| title / prefix / suffix | 标题 / 前缀 / 后缀 | string | — |
| valueStyle | 数值样式 | string / object | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| title / prefix / suffix | 自定义对应内容 |
