[toc]

## StatTile

Dash data-visualization component: a big-number metric tile plus a responsive tile grid. `RumoStatTile` renders value + label with optional tooltip / change caption; `RumoStatGrid` lays tiles out in 2/4 columns. Values use `.rumo-num` tabular figures and the `--rumo-text-*` type scale.

### Basic usage

`value` is the metric, `label` its name; `hint` is a native tooltip and `delta` is the change caption.
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="2">
    <rumo-stat-tile label="Visits today" value="12,480" />
    <rumo-stat-tile
      label="Conversion"
      value="3.6%"
      hint="Conversion = successful orders / visits"
      delta="+0.4%"
      tone="success"
    />
  </rumo-stat-grid>
</div>
```
:::

### Delta tone & loading

`tone` colors `delta`; `loading` swaps the value area for a placeholder.
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="3">
    <rumo-stat-tile label="Active users" value="8,210" delta="+12%" tone="success" />
    <rumo-stat-tile label="Refund rate" value="1.2%" delta="+0.3%" tone="danger" />
    <rumo-stat-tile label="Pending" value="36" delta="flat" tone="warning" loading />
  </rumo-stat-grid>
</div>
```
:::

### Slots

`icon` sits above the value, `default` replaces the value area, `label` replaces the name.
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="2">
    <rumo-stat-tile label="Orders" delta="+8%">
      <template slot="icon">★</template>
      <template slot="default">
        <span style="color: var(--rumo-c-accent, #856AF9);">1,024</span>
      </template>
    </rumo-stat-tile>
    <rumo-stat-tile value="99.95%">
      <template slot="label">
        <strong>Uptime</strong>
      </template>
    </rumo-stat-tile>
  </rumo-stat-grid>
</div>
```
:::

### StatGrid layout

`columns` sets the wide-viewport column count (1-8, default 4) and falls back to 2 columns on narrow viewports; `gap` accepts a pixel number or any CSS length.
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="4" :gap="12">
    <rumo-stat-tile label="Visits" value="12.4k" />
    <rumo-stat-tile label="Orders" value="860" />
    <rumo-stat-tile label="Revenue" value="¥52,300" />
    <rumo-stat-tile label="AOV" value="¥60.8" />
  </rumo-stat-grid>
  <rumo-stat-grid :columns="2" :gap="8" style="margin-top: 12px;">
    <rumo-stat-tile label="Vs last week" value="+6.2%" />
    <rumo-stat-tile label="Monthly goal" value="78%" delta="on track" tone="success" />
  </rumo-stat-grid>
</div>
```
:::

### StatTile Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| label | Metric name | string | — | '' |
| value | Metric value | string / number | — | '' |
| hint | Tooltip text on the value and label | string | — | '' |
| delta | Change caption | string | — | '' |
| tone | Delta tone | string | success / warning / danger / '' | '' |
| loading | Loading placeholder in the value area | boolean | — | false |

### StatGrid Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| columns | Column count; falls back to 2 on narrow viewports | number | 1-8 | 4 |
| gap | Grid gap; numbers are px | number / string | — | 8 |

### Slots
| Name | Description |
|---|---|
| default | StatTile value area (falls back to `value`); tile list inside StatGrid |
| label | StatTile name area; falls back to `label` |
| icon | Icon area above the StatTile value |

### StatGrid ships with RumoStatTile

`RumoStatGrid` is registered by `RumoStatTile`'s `install`, so a single `Vue.use` of either entry exposes both components.
