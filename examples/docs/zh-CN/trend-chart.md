[toc]

## TrendChart 柱状趋势图

Dash 数据可视化组件:用 DOM 柱状图展示一段序列的走势,支持缺口插值、预测虚化、悬停 tooltip 与放大弹窗。不依赖图表库,柱高按量程百分比渲染,网格线与 tooltip 均为普通 DOM。

`series` 中的 `null` 表示缺口:柱高按邻柱插值(单侧有数据时做距离衰减外推),视觉上弱化显示。`missing` / `future` 传入索引列表,分别标记缺口柱与预测柱。

### 基础用法

`series` 传入数值数组即可;`labels` 与之对齐,缺省用索引。
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

### 缺口与预测

`null` 为真缺口,柱高插值且弱化;`missing` / `future` 索引列表分别控制缺口与预测的视觉。真 0 是观测值,不会被插值覆盖。
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

### 标题、格式化与放大

`formatter` 控制 tooltip 数值文案;`zoomable` 显示放大按钮并触发 `zoom` 事件,配合 `RumoTrendZoom` 打开大图。
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
    <span slot="title">请求量趋势</span>
  </rumo-trend-chart>

  <rumo-trend-zoom
    :visible.sync="zoomOpen"
    title="请求量趋势"
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
        return Number(value).toLocaleString() + ' 次';
      }
    }
  };
</script>
```
:::

### 高度与嵌入

`height` 接受像素数字或任意 CSS 长度;`embedded` 去掉外边距与标题,用于弹窗内嵌。
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
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| series | 数值序列,`null` 表示缺口(柱高插值、视觉弱化) | array | — | [] |
| labels | 与 series 对齐的轴/标题文案,缺省用索引 | array | — | [] |
| missing | 弱化显示的索引列表(缺口) | array | — | [] |
| future | 虚化/浅色显示的索引列表(预测) | array | — | [] |
| formatter | 数值格式化 `(value, index) => string`,用于 tooltip;无 label 时也作轴文案 | function | — | — |
| height | 绘图区高度,数字按 px | number / string | — | 160 |
| embedded | 嵌入模式:去掉外边距与标题 | boolean | — | false |
| zoomable | 是否显示放大按钮 | boolean | — | false |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| zoom | 点击放大按钮时触发 | — |
| bar-click | 点击某根柱时触发 | 归一化柱对象 `{ index, label, value, displayValue, kind }` |

### Slots
| 名称 | 说明 |
|---|---|
| title | 标题区内容(非 embedded 时渲染) |

## TrendZoom 放大弹窗

外层复用 `RumoDialog`,内部为同一套 `RumoTrendChart`(`embedded` 模式)。`visible` 支持 `v-model` / `.sync`。

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| visible | 弹窗可见性(v-model / .sync) | boolean | — | false |
| series | 同 TrendChart | array | — | [] |
| labels | 同 TrendChart | array | — | [] |
| missing | 同 TrendChart | array | — | [] |
| future | 同 TrendChart | array | — | [] |
| formatter | 同 TrendChart | function | — | — |
| title | 弹窗标题 | string | — | — |
| width | 弹窗宽度 | string | — | 72% |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| update:visible | 可见性变化 | boolean |
| close | 弹窗关闭时触发 | — |
| bar-click | 点击某根柱时触发 | 归一化柱对象 |
