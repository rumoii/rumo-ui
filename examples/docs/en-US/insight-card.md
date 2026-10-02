[toc]

## InsightCard

Dash data-visualization component: a generic title + insights list card. Each insight carries `label` / `value` and optional `delta` with `tone`; title, per-row icon and footer slots are supported, and clicking a row fires `insight-click`. The body uses the `.rumo-panel` visual language with `--rumo-*` color variables.

### Basic usage

Pass `{ label, value }` items through `insights`; `value` is display text already formatted by the consumer.
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card
    title="Weekly overview"
    :insights="[
      { label: 'Active users', value: '12,480' },
      { label: 'Conversion', value: '3.6%' },
      { label: 'Avg latency', value: '248ms' }
    ]"
  />
</div>
```
:::

### Delta & tone

`delta` shows a change hint; `tone` accepts `success` / `warning` / `danger` and colors the delta only. Neutral gray by default.
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card
    title="Health"
    :insights="[
      { label: 'Success rate', value: '99.2%', delta: '+0.4%', tone: 'success' },
      { label: 'Errors', value: '36', delta: '+12', tone: 'danger' },
      { label: 'Queue backlog', value: '128', delta: 'flat', tone: '' }
    ]"
  />
</div>
```
:::

### Slots & click

`title` / `footer` are normal slots; `icon` is scoped with `{ insight }`. Clicking a row fires `insight-click(insight)`.
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card :insights="insights" @insight-click="onClick">
    <template slot="title">
      <strong style="color: var(--rumo-c-ink, #0a0b0d);">Channel mix</strong>
    </template>
    <template slot="icon" slot-scope="{ insight }">
      <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--rumo-c-accent, #856AF9);"></span>
    </template>
    <template slot="footer">Refreshed every 15 minutes</template>
  </rumo-insight-card>
</div>
<script>
  export default {
    data: function() {
      return {
        insights: [
          { label: 'Organic', value: '4,210', delta: '+8%', tone: 'success' },
          { label: 'Paid', value: '2,860', delta: '-3%', tone: 'warning' },
          { label: 'Email recall', value: '940', delta: '+21%', tone: 'success' }
        ]
      };
    },
    methods: {
      onClick(item) {
        if (this.$message) this.$message('click: ' + item.label);
      }
    }
  };
</script>
```
:::

### Loading

When `loading` is `true`, skeleton placeholders are rendered instead of the list.
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card title="Loading" loading />
</div>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| title | Card title; the `title` slot wins when present | string | — | '' |
| insights | Insight rows; items carry `label` / `value` / `delta?` / `tone?` | array | — | [] |
| loading | Whether the card is in loading state | boolean | — | false |

### Events
| Event | Description | Arguments |
|---|---|---|
| insight-click | Fired when an insight row is clicked | the clicked insight object |

### Slots
| Name | Description |
|---|---|
| title | Card title; falls back to the `title` prop |
| icon | Per-row icon; scoped with `{ insight }` |
| footer | Supplementary note under the list |
