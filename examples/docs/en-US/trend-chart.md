[toc]

## TrendChart

Dash data-visualization component: a DOM bar chart for a numeric trend, with gap interpolation, faint future bars, hover tooltip, and an optional zoom dialog. No chart library — bar heights are percentage-based, and the grid plus tooltip are plain DOM.

A `null` in `series` is a gap: bar height is interpolated from neighbouring bars (one-sided gaps extrapolate with mild distance decay) and rendered weakened. Pass index lists through `missing` / `future` to mark gap and prediction bars.

### Basic usage

Pass a numeric array through `series`; `labels` aligns with it and falls back to the index.
:::demo
```html
<div class="rumo-dash">
  <rumo-trend-chart
    :series="[12, 18, 22, 30, 28, 35, 40, 38, 42, 46]"
    :labels="['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10']"
  />
</div>
```
:::

### Gaps & predictions

`null` is a true gap (interpolated height, weakened look); `missing` / `future` index lists drive the gap and prediction styling. A real `0` is an observation and is never interpolated over.
:::demo
```html
<div class="rumo-dash">
  <rumo-trend-chart
    :series="[18, 22, null, 26, 30, null, null, 34, 38, 36, 40, 44]"
    :labels="['04-01', '04-02', '04-03', '04-04', '04-05', '04-06', '04-07', '04-08', '04-09', '04-10', '04-11', '04-12']"
    :missing="[2, 5, 6]"
    :future="[10, 11]"
  />
</div>
```
:::

### Title, formatter & zoom

`formatter` controls the tooltip value text; `zoomable` shows the zoom button and emits `zoom`, which typically opens `RumoTrendZoom`.
:::demo
```html
<div class="rumo-dash">
  <rumo-trend-chart
    zoomable
    :series="series"
    :labels="labels"
    :missing="[3]"
    :future="[10, 11]"
    :formatter="fmt"
    @zoom="zoomOpen = true"
  >
    <span slot="title">Request volume</span>
  </rumo-trend-chart>

  <rumo-trend-zoom
    :visible.sync="zoomOpen"
    title="Request volume"
    :series="series"
    :labels="labels"
    :missing="[3]"
    :future="[10, 11]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    data() {
      return {
        zoomOpen: false,
        series: [12, 18, 22, null, 30, 28, 35, 40, 38, 42, 46, 44],
        labels: ['05-01', '05-02', '05-03', '05-04', '05-05', '05-06', '05-07', '05-08', '05-09', '05-10', '05-11', '05-12']
      };
    },
    methods: {
      fmt(value, index) {
        return Number(value).toLocaleString() + ' hits';
      }
    }
  };
</script>
```
:::

### Height & embedded

`height` accepts a pixel number or any CSS length; `embedded` drops the outer margin and title for use inside a dialog.
:::demo
```html
<div class="rumo-dash">
  <rumo-trend-chart
    :height="100"
    :series="[5, 9, 7, 12, 15, 11, 18, 16]"
  />
  <rumo-trend-chart
    height="120px"
    embedded
    style="margin-top: 12px;"
    :series="[5, 9, 7, 12, 15, 11, 18, 16]"
  />
</div>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| series | Numeric series; `null` marks a gap (interpolated height) | array | — | [] |
| labels | Axis / tooltip labels aligned with series; defaults to the index | array | — | [] |
| missing | Index list rendered as weakened gaps | array | — | [] |
| future | Index list rendered as faint / dashed bars | array | — | [] |
| formatter | Value formatter `(value, index) => string` for the tooltip; also axis text when labels are missing | function | — | — |
| height | Plot height; numbers are px | number / string | — | 160 |
| embedded | Embedded mode: drop outer margin and title | boolean | — | false |
| zoomable | Whether the zoom button is shown | boolean | — | false |

### Events
| Event | Description | Arguments |
|---|---|---|
| zoom | Fired when the zoom button is clicked | — |
| bar-click | Fired when a bar is clicked | normalized segment `{ index, label, value, displayValue, kind }` |

### Slots
| Name | Description |
|---|---|
| title | Header content (rendered when not embedded) |

## TrendZoom

Wraps the existing `RumoDialog` and renders the same `RumoTrendChart` in embedded mode. `visible` supports `v-model` / `.sync`.

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| visible | Dialog visibility (v-model / .sync) | boolean | — | false |
| series | Same as TrendChart | array | — | [] |
| labels | Same as TrendChart | array | — | [] |
| missing | Same as TrendChart | array | — | [] |
| future | Same as TrendChart | array | — | [] |
| formatter | Same as TrendChart | function | — | — |
| title | Dialog title | string | — | — |
| width | Dialog width | string | — | 72% |

### Events
| Event | Description | Arguments |
|---|---|---|
| update:visible | Fired when visibility changes | boolean |
| close | Fired when the dialog closes | — |
| bar-click | Fired when a bar is clicked | normalized segment |
