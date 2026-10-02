[toc]

## BreakdownList 类别占比列表

Dash 数据可视化组件:按行展示各类别的数值与占比,每行自带「行内分布条」(按占比染色的行背景)。支持可展开分组,子行缩进显示;图标位默认是色块,可由 `icon` 插槽替换。颜色缺省按 `series-1` 至 `series-8` 分类色板循环。

### 基础用法

`rows` 传入 `{ label, value }` 数组即可;顶层占比缺省按各行数值相对合计计算。
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="[
      { label: '图片素材', value: 4200 },
      { label: '视频素材', value: 3100 },
      { label: '音频素材', value: 1800 },
      { label: '其他', value: 900 }
    ]"
  />
</div>
```
:::

### 自定义数值

`formatter(row)` 控制右侧数值文案;`percent` 可显式给出,不按合计推算。
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="[
      { label: '华东区', value: 62000, percent: 52.4 },
      { label: '华南区', value: 24000, percent: 20.3 },
      { label: '华北区', value: 14000, percent: 11.8 },
      { label: '其他', value: 18000, percent: 15.5 }
    ]"
    :formatter="fmt"
  />
</div>
<script>
  export default {
    methods: {
      fmt(row) {
        return row.value.toLocaleString() + ' 次';
      }
    }
  };
</script>
```
:::

### 可展开分组

有 `children` 的行显示展开箭头;`default-expand-all` 初始全部展开,`expandable` 关闭后子行常显且不提供交互。
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="groups"
    @toggle="onToggle"
    @row-click="onRowClick"
  />
  <rumo-breakdown-list
    style="margin-top: 16px;"
    :rows="groups"
    :expandable="false"
  />
</div>
<script>
  export default {
    data() {
      return {
        groups: [
          {
            label: '前端资源',
            value: 7800,
            children: [
              { label: '脚本', value: 4200 },
              { label: '样式', value: 2100 },
              { label: '字体', value: 1500 }
            ]
          },
          {
            label: '接口调用',
            value: 5200,
            children: [
              { label: '查询类', value: 3300 },
              { label: '写入类', value: 1900 }
            ]
          },
          { label: '静态页面', value: 2000 }
        ]
      };
    },
    methods: {
      onToggle(row, expanded) {
        this.$message && this.$message(row.label + (expanded ? ' 展开' : ' 收起'));
      },
      onRowClick(row) {
        this.$message && this.$message('row-click: ' + row.label);
      }
    }
  };
</script>
```
:::

### 图标插槽

`icon` 作用域插槽替换默认色块,作用域参数为 `row`。
:::demo
```html
<div class="rumo-dash">
  <rumo-breakdown-list
    :rows="[
      { label: '高优先级', value: 320, color: 'var(--rumo-c-danger, #ef4444)' },
      { label: '中优先级', value: 540, color: 'var(--rumo-c-warning, #f59e0b)' },
      { label: '低优先级', value: 810, color: 'var(--rumo-c-success, #10b981)' }
    ]"
  >
    <template slot="icon" slot-scope="{ row }">
      <span
        style="display: inline-block; width: 8px; height: 8px; border-radius: 50%;"
        :style="{ backgroundColor: row.color }"
      ></span>
    </template>
    <template slot="title">工单优先级分布</template>
  </rumo-breakdown-list>
</div>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| rows | 类别行,项含 `label` / `value` / `key?` / `percent?` / `color?` / `children?` | array | — | [] |
| formatter | 右侧数值格式化 `(row) => string` | function | — | — |
| expandable | 有 children 时是否提供展开交互;false 时子行常显 | boolean | — | true |
| default-expand-all | 初始是否展开全部分组 | boolean | — | false |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| row-click | 点击某行时触发 | 该行原始数据对象 |
| toggle | 分组展开/收起时触发 | `(row, expanded)` |

### Slots
| 名称 | 说明 |
|---|---|
| title | 列表上方标题区 |
| icon | 行图标位,作用域参数 `row`;缺省渲染色块 |
