[toc]

## RankList

Dash data-visualization component: a top-N ranking list. Each row shows rank, name, value and an optional share bar / percentage; supports a custom value caption, a badge area and row clicks.

### Basic usage

Pass `{ name, value }` items through `items`; rank defaults to the index + 1 and 3 rows are shown by default.
:::demo
```html
<div class="rumo-dash">
  <rumo-rank-list
    :items="[
      { name: 'Basic', value: 4200, percent: 42 },
      { name: 'Pro', value: 3100, percent: 31 },
      { name: 'Ultimate', value: 1800, percent: 18 },
      { name: 'Others', value: 900, percent: 9 }
    ]"
  />
</div>
```
:::

### Custom values & row count

`value-text` formats the value caption, `max` limits the rows, `show-bar` turns the share bar off.
:::demo
```html
<div class="rumo-dash">
  <rumo-rank-list
    :max="4"
    :show-bar="false"
    :items="[
      { rank: 1, name: 'Product A', value: 128000 },
      { rank: 2, name: 'Product B', value: 96000 },
      { rank: 3, name: 'Product C', value: 45000 },
      { rank: 4, name: 'Product D', value: 21000 }
    ]"
    :value-text="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(item) {
        return item.value.toLocaleString() + ' hits';
      }
    }
  };
</script>
```
:::

### Bar color, badge slot & click

`color` overrides the bar color; the `badge` slot sits at the top of the list; clicking a row fires `item-click`.
:::demo
```html
<div class="rumo-dash">
  <rumo-rank-list
    :items="items"
    :max="3"
    @item-click="onClick"
  >
    <template slot="badge">
      <span style="padding: 2px 8px; border-radius: 9999px; background: var(--rumo-c-accent-100, #e9e9fe); color: var(--rumo-c-accent-dark, #7355e3); font-size: 11px;">Top 3</span>
    </template>
  </rumo-rank-list>
</div>
<script>
  export default {
    data: function() {
      return {
        items: [
          { name: 'North', value: 5200, percent: 52, color: 'var(--rumo-c-series-1)' },
          { name: 'East', value: 3100, percent: 31, color: 'var(--rumo-c-series-2)' },
          { name: 'South', value: 1700, percent: 17, color: 'var(--rumo-c-series-3)' }
        ]
      };
    },
    methods: {
      onClick(item) {
        this.$message && this.$message('item-click: ' + item.name);
      }
    }
  };
</script>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| items | Rank rows; items carry `name` / `value` / `rank?` / `percent?` / `color?` | array | — | [] |
| max | How many rows are shown | number | — | 3 |
| value-text | Value caption formatter `(item) => string` | function | — | — |
| show-bar | Whether the inline share bar is rendered | boolean | — | true |

### Events
| Event | Description | Arguments |
|---|---|---|
| item-click | Fired when a row is clicked | original item object, normalized row object |

### Slots
| Name | Description |
|---|---|
| badge | Badge area at the top of the list |
