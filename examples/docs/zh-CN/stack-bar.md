[toc]

## StackBar 分布条

Dash 数据可视化组件:用一条圆角比例条展示各数据段的占比,可配图例与自定义数值格式。颜色缺省按 `series-1` 至 `series-8` 分类色板循环,可由 `color` 覆盖。

### 基础用法

`segments` 传入 `{ label, value }` 数组即可;总量缺省为各段之和。
:::demo
```html
<div class="rumo-dash">
  <rumo-stack-bar
    :segments="[
      { label: '服务 A', value: 4200 },
      { label: '服务 B', value: 3100 },
      { label: '服务 C', value: 1800 },
      { label: '其他', value: 900 }
    ]"
  />
</div>
```
:::

### 自定义数值与图例

`formatter` 控制图例数值文案;`legend-position` 可置于顶部或隐藏。
:::demo
```html
<div class="rumo-dash">
  <rumo-stack-bar
    legend-position="top"
    :segments="[
      { label: '输入 tokens', value: 62000, color: 'var(--rumo-c-series-2)' },
      { label: '输出 tokens', value: 24000, color: 'var(--rumo-c-series-4)' },
      { label: '缓存读取', value: 14000, color: 'var(--rumo-c-series-3)' }
    ]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(seg, percent) {
        return seg.value.toLocaleString() + ' (' + percent.toFixed(1) + '%)';
      }
    }
  };
</script>
```
:::

### 高度与无图例

`height` 接受像素数字或任意 CSS 长度;`show-legend` 关闭图例。
:::demo
```html
<div class="rumo-dash">
  <rumo-stack-bar
    :height="10"
    :show-legend="false"
    :segments="[
      { label: 'A', value: 30 },
      { label: 'B', value: 45 },
      { label: 'C', value: 25 }
    ]"
  />
  <rumo-stack-bar
    height="4px"
    :show-legend="false"
    style="margin-top: 12px;"
    :segments="[
      { label: 'A', value: 30 },
      { label: 'B', value: 45 },
      { label: 'C', value: 25 }
    ]"
  />
</div>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| segments | 数据段,项含 `label` / `value` / `key?` / `color?` | array | — | [] |
| total | 声明总量,缺省为各段之和 | number / string | — | 0 |
| height | 轨道高度,数字按 px | number / string | — | 6 |
| show-legend | 是否显示图例 | boolean | — | true |
| legend-position | 图例位置 | string | top / bottom / none | bottom |
| formatter | 图例数值格式化 `(segment, percent) => string` | function | — | — |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| segment-click | 点击某数据段(条或图例)时触发 | 归一化后的段对象 |
