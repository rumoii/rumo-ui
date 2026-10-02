[toc]

## RatioCard

Dash data-visualization component: a panel card showing a set of detail rows and their shares. Each row carries an icon slot, label, value and ratio text, with a thin distribution bar underneath tinted to the share. `total` defaults to the sum of values; colors cycle through the `series-1`–`series-8` categorical palette by default.

### Basic usage

Pass `{ label, value }` items through `items`; ratios default to each value relative to the total.
:::demo
```html
<div class="rumo-dash">
  <rumo-ratio-card
    title="Resource usage"
    :items="[
      { label: 'Workstation A', value: 4200 },
      { label: 'Workstation B', value: 3100 },
      { label: 'Mobile device', value: 1800 },
      { label: 'Others', value: 900 }
    ]"
  />
</div>
```
:::

### Custom values & total

`formatter(item)` controls the right-side value text; pass `total` to declare the denominator, or `ratio` to pin a share explicitly.
:::demo
```html
<div class="rumo-dash">
  <rumo-ratio-card
    title="Channel mix"
    :total="100000"
    :items="[
      { label: 'Direct online', value: 52000, ratio: 52.0 },
      { label: 'Resellers', value: 28000, ratio: 28.0 },
      { label: 'Retail stores', value: 14000, ratio: 14.0 },
      { label: 'Others', value: 6000, ratio: 6.0 }
    ]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(item) {
        return item.value.toLocaleString() + ' units';
      }
    }
  };
</script>
```
:::

### Slots

The `header` slot replaces the card title; the scoped `icon` slot replaces the default color square with `item` as its scope prop.
:::demo
```html
<div class="rumo-dash">
  <rumo-ratio-card
    :items="[
      { label: 'Primary service', value: 6200, color: 'var(--rumo-c-series-2, #3b82f6)' },
      { label: 'Backup service', value: 2400, color: 'var(--rumo-c-series-3, #14b8a6)' },
      { label: 'Job queue', value: 1400, color: 'var(--rumo-c-series-4, #f59e0b)' }
    ]"
  >
    <template slot="header">
      <span style="color: var(--rumo-c-ink, #0a0b0d); text-transform: none;">Node load</span>
    </template>
    <template slot="icon" slot-scope="{ item }">
      <span
        style="display: inline-block; width: 8px; height: 8px; border-radius: 50%;"
        :style="{ backgroundColor: item.color }"
      ></span>
    </template>
  </rumo-ratio-card>
</div>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| title | Card title | string | — | '' |
| items | Detail rows; items carry `label` / `value` / `ratio?` / `color?` | array | — | [] |
| total | Declared total; defaults to the sum of item values | number / string | — | 0 |
| formatter | Right-side value formatter `(item) => string` | function | — | — |

### Slots
| Name | Description |
|---|---|
| header | Card header; falls back to the `title` prop |
| icon | Row icon; scoped with `item`. Falls back to the color square |
