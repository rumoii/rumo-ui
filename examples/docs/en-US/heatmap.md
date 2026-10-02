[toc]

## Heatmap

Dash data-visualization component: a week-column calendar heatmap with a 5-level color scale (empty / low / mid / high / peak). Levels are derived from value quantiles and can be overridden via `palette`. The calendar range covers the min/max date in `cells`; days without a row render as the empty level.

### Basic usage

Pass `{ date, value }` items through `cells`; dates are `YYYY-MM-DD`. The grid scrolls horizontally and starts at the most recent week.
:::demo
```html
<div class="rumo-dash">
  <rumo-heatmap :cells="cells" />
</div>
<script>
  function buildDemoCells() {
    var out = [];
    var today = new Date();
    for (var i = 140; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      var date = y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      var seed = day * 3 + m * 7 + i;
      out.push({ date: date, value: seed % 5 === 0 ? 0 : (seed % 37) + 1 });
    }
    return out;
  }

  export default {
    data: function() {
      return { cells: buildDemoCells() };
    }
  };
</script>
```
:::

### Custom palette & tooltip

`palette` overrides the 5-level scale; `format-tooltip` controls the hover text; use the `title` slot for a header line.
:::demo
```html
<div class="rumo-dash">
  <rumo-heatmap :cells="cells" :format-tooltip="tip">
    <template slot="title">Last 3 months</template>
  </rumo-heatmap>
  <rumo-heatmap
    style="margin-top: 16px;"
    :cells="cells"
    :palette="palette"
    :format-tooltip="tip"
    :month-labels="false"
  />
</div>
<script>
  function buildDemoCells() {
    var out = [];
    var today = new Date();
    for (var i = 90; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      var date = y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      var seed = day * 5 + i * 2;
      out.push({ date: date, value: seed % 6 === 0 ? 0 : (seed % 53) + 1 });
    }
    return out;
  }

  export default {
    data: function() {
      return {
        cells: buildDemoCells(),
        palette: [
          'var(--rumo-c-neutral-100, #eff2f9)',
          'var(--rumo-c-series-3, #14b8a6)',
          'var(--rumo-c-series-2, #3b82f6)',
          'var(--rumo-c-series-1, #8b5cf6)',
          'var(--rumo-c-accent-800, #4f38a2)'
        ]
      };
    },
    methods: {
      tip: function(date, value) {
        return date + ' · ' + value + ' events';
      }
    }
  };
</script>
```
:::

### Week start, size & labels

`week-starts-on` supports Sunday or Monday starts; `cell-size` / `gap` accept a pixel number or any CSS length; `weekday-labels` keeps only the Mon/Wed/Fri rows.
:::demo
```html
<div class="rumo-dash">
  <rumo-heatmap
    :cells="cells"
    :week-starts-on="0"
    :cell-size="14"
    :gap="4"
    :weekday-labels="false"
  />
</div>
<script>
  function buildDemoCells() {
    var out = [];
    var today = new Date();
    for (var i = 60; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      var date = y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      out.push({ date: date, value: (day + i) % 4 === 0 ? 0 : ((day * 11 + i) % 29) + 1 });
    }
    return out;
  }

  export default {
    data: function() {
      return { cells: buildDemoCells() };
    }
  };
</script>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| cells | Day cells; items carry `date` (`YYYY-MM-DD`) / `value` | array | — | [] |
| week-starts-on | First day of the week; 0 = Sunday, 1 = Monday | number | 0 / 1 | 1 |
| palette | 5-level color scale (empty / low / mid / high / peak) | array | — | accent-50/200/400/600/800 |
| cell-size | Cell size; numbers are px | number / string | — | 12 |
| gap | Gap between cells; numbers are px | number / string | — | 3 |
| format-tooltip | Tooltip text formatter `(date, value) => string` | function | — | `date: value` |
| month-labels | Whether month labels are rendered | boolean | — | true |
| weekday-labels | Whether Mon/Wed/Fri weekday labels are rendered | boolean | — | true |

### Events
| Event | Description | Arguments |
|---|---|---|
| cell-click | Fired when a day cell is clicked | `{ date, value }` |

### Slots
| Name | Description |
|---|---|
| title | Header line above the heatmap |
