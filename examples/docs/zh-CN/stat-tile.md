[toc]

## StatTile 指标磁贴

Dash 数据可视化组件:大数字指标磁贴与响应式磁贴栅格。`RumoStatTile` 展示「数值 + 名称 + 可选 tooltip/环比」,`RumoStatGrid` 把磁贴排成 2/4 列栅格。数值区使用 `.rumo-num` 等宽数字与 `--rumo-text-*` 字阶。

### 基础用法

`value` 为指标数值,`label` 为名称;`hint` 挂原生 tooltip,`delta` 为环比文案。
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="2">
    <rumo-stat-tile label="今日访问" value="12,480" />
    <rumo-stat-tile
      label="转化率"
      value="3.6%"
      hint="转化率 = 成功订单 / 访问量"
      delta="+0.4%"
      tone="success"
    />
  </rumo-stat-grid>
</div>
```
:::

### 环比着色与加载态

`tone` 为 `delta` 着色;`loading` 时数值区显示占位块。
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="3">
    <rumo-stat-tile label="活跃用户" value="8,210" delta="+12%" tone="success" />
    <rumo-stat-tile label="退款率" value="1.2%" delta="+0.3%" tone="danger" />
    <rumo-stat-tile label="待处理" value="36" delta="持平" tone="warning" loading />
  </rumo-stat-grid>
</div>
```
:::

### 插槽

`icon` 在数值上方,`default` 替换数值区,`label` 替换名称区。
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="2">
    <rumo-stat-tile label="订单数" delta="+8%">
      <template slot="icon">★</template>
      <template slot="default">
        <span style="color: var(--rumo-c-accent, #856AF9);">1,024</span>
      </template>
    </rumo-stat-tile>
    <rumo-stat-tile value="99.95%">
      <template slot="label">
        <strong>可用率</strong>
      </template>
    </rumo-stat-tile>
  </rumo-stat-grid>
</div>
```
:::

### StatGrid 布局

`columns` 控制宽视口列数(1-8,默认 4),窄视口按 2 列回落;`gap` 接受像素数字或任意 CSS 长度。
:::demo
```html
<div class="rumo-dash">
  <rumo-stat-grid :columns="4" :gap="12">
    <rumo-stat-tile label="访问" value="12.4k" />
    <rumo-stat-tile label="下单" value="860" />
    <rumo-stat-tile label="营收" value="¥52,300" />
    <rumo-stat-tile label="客单价" value="¥60.8" />
  </rumo-stat-grid>
  <rumo-stat-grid :columns="2" :gap="8" style="margin-top: 12px;">
    <rumo-stat-tile label="上周对比" value="+6.2%" />
    <rumo-stat-tile label="本月目标" value="78%" delta="进度正常" tone="success" />
  </rumo-stat-grid>
</div>
```
:::

### StatTile Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| label | 指标名称 | string | — | '' |
| value | 指标数值 | string / number | — | '' |
| hint | tooltip 文案,挂在数值与标签上 | string | — | '' |
| delta | 环比/变化文案 | string | — | '' |
| tone | delta 着色 | string | success / warning / danger / '' | '' |
| loading | 数值区加载占位 | boolean | — | false |

### StatGrid Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| columns | 列数,窄视口按 2 列回落 | number | 1-8 | 4 |
| gap | 栅格间距,数字按 px | number / string | — | 8 |

### Slots
| 名称 | 说明 |
|---|---|
| default | StatTile 数值区,缺省显示 `value`;StatGrid 内为磁贴列表 |
| label | StatTile 名称区,缺省显示 `label` |
| icon | StatTile 数值上方的图标区 |

### StatGrid 与 RumoStatTile 同包

`RumoStatGrid` 由 `RumoStatTile` 的 `install` 一并注册,单独 `Vue.use` 安装任一入口后两个组件都可用。
