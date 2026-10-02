[toc]

## RatioCard 占比卡

Dash 数据可视化组件:面板卡体展示一组明细的占比。每行含图标位、标签、数值与占比文案,下方细分布条按占比着色。`total` 缺省为各行之和,颜色缺省按 `series-1` 至 `series-8` 分类色板循环。

### 基础用法

`items` 传入 `{ label, value }` 数组即可;占比缺省按各行数值相对合计计算。
:::demo
```html
<div class="rumo-dash">
  <rumo-ratio-card
    title="资源消耗"
    :items="[
      { label: '工作站 A', value: 4200 },
      { label: '工作站 B', value: 3100 },
      { label: '移动设备', value: 1800 },
      { label: '其他', value: 900 }
    ]"
  />
</div>
```
:::

### 自定义数值与总量

`formatter(item)` 控制右侧数值文案;`total` 可显式声明合计;`ratio` 可显式给出占比。
:::demo
```html
<div class="rumo-dash">
  <rumo-ratio-card
    title="渠道占比"
    :total="100000"
    :items="[
      { label: '线上直投', value: 52000, ratio: 52.0 },
      { label: '渠道分销', value: 28000, ratio: 28.0 },
      { label: '线下门店', value: 14000, ratio: 14.0 },
      { label: '其他', value: 6000, ratio: 6.0 }
    ]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(item) {
        return item.value.toLocaleString() + ' 元';
      }
    }
  };
</script>
```
:::

### 插槽

`header` 插槽自定义卡头;`icon` 作用域插槽替换默认色块,作用域参数为 `item`。
:::demo
```html
<div class="rumo-dash">
  <rumo-ratio-card
    :items="[
      { label: '主服务', value: 6200, color: 'var(--rumo-c-series-2, #3b82f6)' },
      { label: '备份服务', value: 2400, color: 'var(--rumo-c-series-3, #14b8a6)' },
      { label: '任务队列', value: 1400, color: 'var(--rumo-c-series-4, #f59e0b)' }
    ]"
  >
    <template slot="header">
      <span style="color: var(--rumo-c-ink, #0a0b0d); text-transform: none;">节点负载</span>
    </template>
    <template slot="icon" slot-scope="{ item }">
      <span
        style="display: inline-block; width: 8px; height: 8px; border-radius: 50%;"
        :style="{ backgroundColor: item.color }"
      ></span>
    </template>
  </rumo-ratio-card>
</div>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| title | 卡片标题 | string | — | '' |
| items | 明细行,项含 `label` / `value` / `ratio?` / `color?` | array | — | [] |
| total | 声明总量,缺省为各行之和 | number / string | — | 0 |
| formatter | 右侧数值格式化 `(item) => string` | function | — | — |

### Slots
| 名称 | 说明 |
|---|---|
| header | 卡头,缺省用 `title` 属性 |
| icon | 行图标位,作用域参数 `item`;缺省渲染色块 |
