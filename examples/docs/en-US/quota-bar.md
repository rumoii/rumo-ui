[toc]

## QuotaBar

Dash data-visualization component: a quota / usage-limit bar. The head row shows the label on the left and the value plus percentage on the right; a rounded track sits below. Supports a reset-time caption, a pace marker and threshold coloring. `mode="used"` fills for consumption, `mode="remain"` flips the semantics to remaining quota.

### Basic usage

`percent` is the used ratio 0-100; `value` renders on the right and `resetAt` takes a pre-formatted reset caption.
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    label="5h usage"
    :value="12800"
    :percent="42"
    reset-at="3h"
  />
</div>
```
:::

### Near exhaustion

Threshold colors follow usage risk automatically: `<80` success, `80-95` warning, `>95` danger. Override with `tone` when needed.
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    label="Weekly quota"
    value-text="9.6k / 10k"
    :percent="88"
    reset-at="2d"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    label="Team pool"
    :value="2"
    :percent="97"
    reset-at="40m"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    label="Explicit tone"
    :percent="50"
    tone="warning"
    :show-percent="false"
  />
</div>
```
:::

### Pace marker

`pace-percent` cuts a vertical notch into the track as a reference point (for example where usage will land by reset at the current rate). The mark turns danger-colored once the fill crosses it.
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    label="5h usage · under pace"
    :value="18200"
    :percent="38"
    :pace-percent="55"
    reset-at="2h"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    label="5h usage · over pace"
    :value="41000"
    :percent="82"
    :pace-percent="61"
    reset-at="2h"
  />
</div>
```
:::

### remain mode

In `mode="remain"`, `percent` is the remaining ratio: a fuller bar means more quota left. Thresholds mirror the risk (less remaining is worse).
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    mode="remain"
    label="Monthly quota left"
    :value="14500"
    :percent="35"
    reset-at="12d"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    mode="remain"
    label="Weekly quota left"
    :value="400"
    :percent="8"
    :pace-percent="12"
    reset-at="1d"
  />
</div>
```
:::

### Slots

The `label` slot replaces the left label; the `actions` slot appends an action area on the right. Clicking the bar emits `click`.
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    :percent="64"
    :value="6400"
    reset-at="5h"
    @click="onClick"
  >
    <template slot="label">
      <strong>API quota</strong>
    </template>
    <template slot="actions">
      <span style="cursor: pointer; color: var(--rumo-c-accent, #856AF9);">Detail</span>
    </template>
  </rumo-quota-bar>
</div>
<script>
  export default {
    methods: {
      onClick() {
        this.$message && this.$message('quota-bar click');
      }
    }
  };
</script>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| label | Label text on the left | string | — | '' |
| value | Right-side number, consistent with `mode` (used / remaining) | number / string | — | null |
| value-text | Custom right-side value text; defaults to `value` | string | — | '' |
| percent | Displayed percentage 0-100: used ratio in `used` mode, remaining ratio in `remain` mode | number | — | 0 |
| mode | Fill semantics | string | used / remain | used |
| reset-at | Pre-formatted reset caption; hidden when empty | string | — | '' |
| pace-percent | Pace marker position 0-100; hidden when null | number | — | null |
| tone | Threshold color; defaults to auto by usage risk (&lt;80 success, 80-95 warning, &gt;95 danger) | string | success / warning / danger | '' |
| show-percent | Whether the percentage is shown | boolean | — | true |

### Events
| Event | Description | Arguments |
|---|---|---|
| click | Fired when the bar is clicked | native click event |

### Slots
| Name | Description |
|---|---|
| label | Left label content; falls back to the `label` prop |
| actions | Extra action area on the right of the head row |
