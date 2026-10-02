[toc]

## BreakdownList

Dash data-visualization component: one row per category with its value and share, each row carrying an inline share bar (a row background tinted to the share width). Groups with `children` expand and indent their nested rows; the icon slot defaults to a color square and can be replaced. Colors cycle through the `series-1`–`series-8` categorical palette by default.

### Basic usage

Pass `{ label, value }` items through `rows`; top-level shares default to each value relative to the total.
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="[
      { label: 'Image assets', value: 4200 },
      { label: 'Video assets', value: 3100 },
      { label: 'Audio assets', value: 1800 },
      { label: 'Others', value: 900 }
    ]"
  />
</div>
```
:::

### Custom values

`formatter(row)` controls the right-side value text; pass `percent` explicitly to skip the total-based calculation.
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="[
      { label: 'East region', value: 62000, percent: 52.4 },
      { label: 'South region', value: 24000, percent: 20.3 },
      { label: 'North region', value: 14000, percent: 11.8 },
      { label: 'Others', value: 18000, percent: 15.5 }
    ]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(row) {
        return row.value.toLocaleString() + ' hits';
      }
    }
  };
</script>
```
:::

### Expandable groups

Rows with `children` show an expand toggle; `default-expand-all` opens every group at start, while `expandable="false"` keeps children always visible without interaction.
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="groups"
    @toggle="onToggle"
    @row-click="onRowClick"
  />
  <rumo-breakdown-list
    style="margin-top: 16px;"
    :rows="groups"
    :expandable="false"
  />
</div>
<script>
  export default {
    data() {
      return {
        groups: [
          {
            label: 'Front-end assets',
            value: 7800,
            children: [
              { label: 'Scripts', value: 4200 },
              { label: 'Styles', value: 2100 },
              { label: 'Fonts', value: 1500 }
            ]
          },
          {
            label: 'API calls',
            value: 5200,
            children: [
              { label: 'Reads', value: 3300 },
              { label: 'Writes', value: 1900 }
            ]
          },
          { label: 'Static pages', value: 2000 }
        ]
      };
    },
    methods: {
      onToggle(row, expanded) {
        this.$message && this.$message(row.label + (expanded ? ' expanded' : ' collapsed'));
      },
      onRowClick(row) {
        this.$message && this.$message('row-click: ' + row.label);
      }
    }
  };
</script>
```
:::

### Icon slot

The scoped `icon` slot replaces the default color square; its scope prop is `row`.
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="[
      { label: 'High priority', value: 320, color: 'var(--rumo-c-danger, #ef4444)' },
      { label: 'Medium priority', value: 540, color: 'var(--rumo-c-warning, #f59e0b)' },
      { label: 'Low priority', value: 810, color: 'var(--rumo-c-success, #10b981)' }
    ]"
  >
    <template slot="icon" slot-scope="{ row }">
      <span
        style="display: inline-block; width: 8px; height: 8px; border-radius: 50%;"
        :style="{ backgroundColor: row.color }"
      ></span>
    </template>
    <template slot="title">Ticket priority mix</template>
  </rumo-breakdown-list>
</div>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| rows | Category rows; items carry `label` / `value` / `key?` / `percent?` / `color?` / `children?` | array | — | [] |
| formatter | Right-side value formatter `(row) => string` | function | — | — |
| expandable | Whether rows with children get an expand toggle; when false children stay visible | boolean | — | true |
| default-expand-all | Whether every group starts expanded | boolean | — | false |

### Events
| Event | Description | Arguments |
|---|---|---|
| row-click | Fired when a row is clicked | the raw row object |
| toggle | Fired when a group expands or collapses | `(row, expanded)` |

### Slots
| Name | Description |
|---|---|
| title | Header area above the list |
| icon | Row icon; scoped with `row`. Falls back to the color square |
