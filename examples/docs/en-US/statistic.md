## Statistic

Display a formatted numeric value.

:::demo

```html
<rumo-statistic title="Visits" :value="12345.67" :precision="2" suffix="times" />
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Value | number | 0 |
| precision | Decimal digits | number | 0 |
| decimalSeparator / groupSeparator | Decimal / group separator | string | . / , |
| formatter | Custom formatting function | function | — |
| title / prefix / suffix | Heading / prefix / suffix | string | — |
| valueStyle | Value style | string / object | — |

### Slots

| Name | Description |
| --- | --- |
| title / prefix / suffix | Custom content |
