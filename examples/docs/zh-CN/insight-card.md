[toc]

## InsightCard 要点卡

Dash 数据可视化组件:标题 + 要点列表的通用卡片。每条要点含 `label` / `value` / 可选 `delta` 与 `tone`,支持标题、图标、底部插槽,点击要点触发 `insight-click`。卡体采用 `.rumo-panel` 视觉,颜色走 `--rumo-*` 变量。

### 基础用法

`insights` 传入 `{ label, value }` 数组即可;`value` 为已格式化文案,组件不负责数字格式。
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card
    title="本周概览"
    :insights="[
      { label: '活跃用户', value: '12,480' },
      { label: '转化率', value: '3.6%' },
      { label: '平均响应', value: '248ms' }
    ]"
  />
</div>
```
:::

### 变化量与色调

`delta` 显示变化提示,`tone` 取 `success` / `warning` / `danger` 着色 delta;缺省为中性灰。
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card
    title="健康度"
    :insights="[
      { label: '成功率', value: '99.2%', delta: '+0.4%', tone: 'success' },
      { label: '错误数', value: '36', delta: '+12', tone: 'danger' },
      { label: '队列积压', value: '128', delta: '持平', tone: '' }
    ]"
  />
</div>
```
:::

### 插槽与点击

`title` / `footer` 为普通插槽;`icon` 为作用域插槽,scope 为 `{ insight }`。点击任一要点触发 `insight-click(insight)`。
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card :insights="insights" @insight-click="onClick">
    <template slot="title">
      <strong style="color: var(--rumo-c-ink, #0a0b0d);">渠道表现</strong>
    </template>
    <template slot="icon" slot-scope="{ insight }">
      <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--rumo-c-accent, #856AF9);"></span>
    </template>
    <template slot="footer">数据每 15 分钟刷新一次</template>
  </rumo-insight-card>
</div>
<script>
  export default {
    data: function() {
      return {
        insights: [
          { label: '自然流量', value: '4,210', delta: '+8%', tone: 'success' },
          { label: '付费投放', value: '2,860', delta: '-3%', tone: 'warning' },
          { label: '邮件召回', value: '940', delta: '+21%', tone: 'success' }
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

### 加载态

`loading` 为 `true` 时渲染占位骨架,不渲染列表。
:::demo
```html
<div class="rumo-dash">
  <rumo-insight-card title="加载中" loading />
</div>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| title | 卡片标题,`title` 插槽存在时优先用插槽 | string | — | '' |
| insights | 要点列表,项含 `label` / `value` / `delta?` / `tone?` | array | — | [] |
| loading | 是否为加载态 | boolean | — | false |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| insight-click | 点击某条要点时触发 | 对应的 insight 对象 |

### Slots
| 名称 | 说明 |
|---|---|
| title | 卡片标题,缺省用 `title` 属性 |
| icon | 要点行图标,作用域参数 `{ insight }` |
| footer | 列表下方的补充说明 |
