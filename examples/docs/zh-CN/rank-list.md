[toc]

## RankList 排行列表

Dash 数据可视化组件:Top N 排行行列表。每行包含排名序号、名称、数值与可选占比条/百分比;支持自定义数值文案、徽标位与行点击。

### 基础用法

`items` 传入 `{ name, value }` 数组即可;排名缺省用索引 + 1,默认显示 3 条。
:::demo
```html
<div class="rumo-dash">
  <rumo-rank-list
    :items="[
      { name: '基础版', value: 4200, percent: 42 },
      { name: '专业版', value: 3100, percent: 31 },
      { name: '旗舰版', value: 1800, percent: 18 },
      { name: '其他', value: 900, percent: 9 }
    ]"
  />
</div>
```
:::

### 自定义数值与条数

`value-text` 格式化数值文案,`max` 控制显示条数,`show-bar` 关闭占比条。
:::demo
```html
<div class="rumo-dash">
  <rumo-rank-list
    :max="4"
    :show-bar="false"
    :items="[
      { rank: 1, name: '产品 A', value: 128000 },
      { rank: 2, name: '产品 B', value: 96000 },
      { rank: 3, name: '产品 C', value: 45000 },
      { rank: 4, name: '产品 D', value: 21000 }
    ]"
    :value-text="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(item) {
        return item.value.toLocaleString() + ' 次';
      }
    }
  };
</script>
```
:::

### 占比条着色、徽标位与点击

`color` 覆盖条色;`badge` 插槽在列表顶部放徽标;点击行触发 `item-click`。
:::demo
```html
<div class="rumo-dash">
  <rumo-rank-list
    :items="items"
    :max="3"
    @item-click="onClick"
  >
    <template slot="badge">
      <span style="padding: 2px 8px; border-radius: 9999px; background: var(--rumo-c-accent-100, #e9e9fe); color: var(--rumo-c-accent-dark, #7355e3); font-size: 11px;">Top 3</span>
    </template>
  </rumo-rank-list>
</div>
<script>
  export default {
    data: function() {
      return {
        items: [
          { name: '华北', value: 5200, percent: 52, color: 'var(--rumo-c-series-1)' },
          { name: '华东', value: 3100, percent: 31, color: 'var(--rumo-c-series-2)' },
          { name: '华南', value: 1700, percent: 17, color: 'var(--rumo-c-series-3)' }
        ]
      };
    },
    methods: {
      onClick(item) {
        this.$message && this.$message('item-click: ' + item.name);
      }
    }
  };
</script>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| items | 榜单项,项含 `name` / `value` / `rank?` / `percent?` / `color?` | array | — | [] |
| max | 显示条数 | number | — | 3 |
| value-text | 数值文案格式化 `(item) => string` | function | — | — |
| show-bar | 是否显示行内占比条 | boolean | — | true |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| item-click | 点击某一行时触发 | 该项原始数据对象,归一化行对象 |

### Slots
| 名称 | 说明 |
|---|---|
| badge | 列表顶部徽标位 |
