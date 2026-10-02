[toc]

## SortableCard 可拖拽卡片

Dash 布局组件:带拖拽把手的卡片壳。按住把手拖动即可换位,原生鼠标/触摸事件实现,不依赖拖拽库。组件只负责拖拽交互与视觉反馈,排序数组由使用方维护;`v-for` 使用时以 `index` 传当前序号,`move` 松手落位时给出 `(fromIndex, toIndex)`。

### 基础用法

单卡即可展示把手与卡体;`header` / 默认插槽分区,把手在顶部中央,按住才触发拖拽。
:::demo
```html
<div class="rumo-dash">
  <rumo-sortable-card style="max-width: 360px;">
    <template slot="header">收入趋势</template>
    <div style="height: 72px; display: flex; align-items: flex-end; gap: 6px;">
      <div v-for="(h, i) in bars" :key="i" :style="{ flex: '1', height: h + '%', background: 'var(--rumo-c-accent, #856AF9)', borderRadius: '3px' }"></div>
    </div>
  </rumo-sortable-card>
</div>
<script>
  export default {
    data: function() {
      return { bars: [40, 62, 48, 80, 56, 72, 90] };
    }
  };
</script>
```
:::

### 卡片组拖拽排序

`v-for` 渲染多卡,各自传 `index`;监听 `move` 交换数组顺序即可实现真实排序。拖动时途经卡片会让位,松手后由使用方落位。
:::demo
```html
<div class="rumo-dash">
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
    <rumo-sortable-card
      v-for="(card, idx) in cards"
      :key="card.id"
      :index="idx"
      @move="onMove"
    >
      <template slot="header">{{ card.title }}</template>
      <div style="color: var(--rumo-c-neutral-600, #505564); font-size: 12px;">
        {{ card.desc }}
      </div>
    </rumo-sortable-card>
  </div>
</div>
<script>
  export default {
    data: function() {
      return {
        cards: [
          { id: 'a', title: '流量来源', desc: '按渠道拆分的访问量占比' },
          { id: 'b', title: '转化漏斗', desc: '从访问到成交的各步流失' },
          { id: 'c', title: '留存曲线', desc: '近 8 周新用户留存变化' },
          { id: 'd', title: '收入构成', desc: '订阅、单次与增值服务' }
        ]
      };
    },
    methods: {
      onMove(from, to) {
        if (from === to) return;
        var next = this.cards.slice();
        var moved = next.splice(from, 1)[0];
        next.splice(to, 0, moved);
        this.cards = next;
      }
    }
  };
</script>
```
:::

### 自定义把手与禁用

`handle` 插槽替换默认圆点把手;`handle` 属性设为 `false` 且不传把手插槽时不渲染拖拽把手;`disabled` 禁用拖拽。
:::demo
```html
<div class="rumo-dash">
  <rumo-sortable-card style="max-width: 360px; margin-bottom: 12px;">
    <template slot="header">自定义把手</template>
    <template slot="handle">≡</template>
    <div style="color: var(--rumo-c-neutral-600, #505564); font-size: 12px;">
      把手内容由插槽接管,拖拽行为不变。
    </div>
  </rumo-sortable-card>

  <rumo-sortable-card :disabled="true" style="max-width: 360px;">
    <template slot="header">已锁定</template>
    <div style="color: var(--rumo-c-neutral-600, #505564); font-size: 12px;">
      disabled 时把手置灰,不响应拖拽。
    </div>
  </rumo-sortable-card>
</div>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| index | 当前序号(在使用方列表中的位置),`move` 的 from 基准 | number | — | 0 |
| disabled | 禁用拖拽 | boolean | — | false |
| handle | 是否显示拖拽把手 | boolean | — | true |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| move | 拖拽松手落位且序号变化时触发 | `(fromIndex, toIndex)` |
| drag-start | 把手上按下开始拖拽时触发 | — |
| drag-end | 拖拽结束(松手或取消)时触发 | — |

### Slots
| 名称 | 说明 |
|---|---|
| handle | 自定义把手内容,缺省为六点握把 |
| header | 卡片头部区 |
| default | 卡片主体 |
