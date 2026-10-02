[toc]

## DateRangePreset

Dash component: preset time-range chips (last 7 days / 30 days, etc.) plus a custom-range popover (reusing DatePicker's `daterange`), for dashboard time-range switching.

### Basic usage

`presets` defines the chips (`days` is a rolling window ending today, or explicit `from`/`to`); `value` is `[from, to]` (`YYYY-MM-DD`) and supports `v-model`.
:::demo
```html
<div class="rumo-dash">
  <rumo-date-range-preset v-model="range" @change="onChange" />
  <div class="rumo-num" style="margin-top: 12px; font-size: var(--rumo-text-caption-size);">
    {{ range[0] }} ~ {{ range[1] }}
  </div>
</div>
<script>
  export default {
    data() {
      var to = new Date();
      var from = new Date();
      from.setDate(from.getDate() - 6);
      function fmt(d) {
        var m = d.getMonth() + 1;
        var day = d.getDate();
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      }
      return {
        range: [fmt(from), fmt(to)]
      };
    },
    methods: {
      onChange(payload) {
        this.$message && this.$message('Switched to ' + payload.from + ' ~ ' + payload.to + ' (' + payload.preset + ')');
      }
    }
  };
</script>
```
:::

### Custom presets & labels

Presets can be fixed ranges; all button labels are customizable.
:::demo
```html
<div class="rumo-dash">
  <rumo-date-range-preset
    v-model="range"
    :presets="[
      { key: 'today', label: 'Today', days: 1 },
      { key: '7d', label: 'Last 7 days', days: 7 },
      { key: 'month', label: 'This month', from: monthFrom, to: monthTo }
    ]"
    custom-label="Custom"
    cancel-text="Cancel"
    apply-text="Apply"
  />
</div>
<script>
  export default {
    computed: {
      monthFrom: function() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-01';
      },
      monthTo: function() {
        var d = new Date();
        var m = d.getMonth() + 1;
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();
      }
    },
    data: function() {
      return { range: [] };
    }
  };
</script>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| presets | Preset list; items carry `label` with `days?` or `from?`+`to?` | array | — | last 7/30/90 days |
| value | Selected range `[from, to]` (YYYY-MM-DD), supports v-model | array | — | [] |
| custom-label | Custom-range trigger label | string | — | Custom |
| cancel-text / apply-text | Popover button labels | string | — | Cancel / Apply |
| active-key | Force the active preset key; inferred from value when empty | string | — | — |

### Events
| Event | Description | Arguments |
|---|---|---|
| change | Fired on selection change | `{ from, to, preset }` |
| preset-click | Fired on preset click or custom apply | preset key |
