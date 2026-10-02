[toc]

## StackBar

Dash data-visualization component: a rounded proportional bar showing each segment's share, with an optional legend and custom value formatting. Colors cycle through the `series-1`–`series-8` categorical palette by default and can be overridden per segment via `color`.

### Basic usage

Pass `{ label, value }` items through `segments`; the total defaults to the sum of values.
:::demo
```html
<div class="rumo-dash">
  <rumo-stack-bar
    :segments="[
      { label: 'Service A', value: 4200 },
      { label: 'Service B', value: 3100 },
      { label: 'Service C', value: 1800 },
      { label: 'Others', value: 900 }
    ]"
  />
</div>
```
:::

### Custom values & legend

`formatter` controls the legend value text; `legend-position` moves the legend to the top or hides it.
:::demo
```html
<div class="rumo-dash">
  <rumo-stack-bar
    legend-position="top"
    :segments="[
      { label: 'Input tokens', value: 62000, color: 'var(--rumo-c-series-2)' },
      { label: 'Output tokens', value: 24000, color: 'var(--rumo-c-series-4)' },
      { label: 'Cache read', value: 14000, color: 'var(--rumo-c-series-3)' }
    ]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(seg, percent) {
        return seg.value.toLocaleString() + ' (' + percent.toFixed(1) + '%)';
      }
    }
  };
</script>
```
:::

### Height & no legend

`height` accepts a pixel number or any CSS length; `show-legend` turns the legend off.
:::demo
```html
<div class="rumo-dash">
  <rumo-stack-bar
    :height="10"
    :show-legend="false"
    :segments="[
      { label: 'A', value: 30 },
      { label: 'B', value: 45 },
      { label: 'C', value: 25 }
    ]"
  />
  <rumo-stack-bar
    height="4px"
    :show-legend="false"
    style="margin-top: 12px;"
    :segments="[
      { label: 'A', value: 30 },
      { label: 'B', value: 45 },
      { label: 'C', value: 25 }
    ]"
  />
</div>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| segments | Data segments; items carry `label` / `value` / `key?` / `color?` | array | — | [] |
| total | Declared total; defaults to the sum of segment values | number / string | — | 0 |
| height | Track height; numbers are px | number / string | — | 6 |
| show-legend | Whether the legend is rendered | boolean | — | true |
| legend-position | Legend position | string | top / bottom / none | bottom |
| formatter | Legend value formatter `(segment, percent) => string` | function | — | — |

### Events
| Event | Description | Arguments |
|---|---|---|
| segment-click | Fired when a segment (bar or legend) is clicked | normalized segment object |
