[toc]

## Dashboard 组合示例

用 Dash 系列组件拼出完整看板布局,作为视觉验收基准:顶部区间切换 + 统计磁贴 + 趋势图 + 榜单 + 热力图 + 分布条 + 配额 + 明细/占比/要点卡。所有组件均以同一份 mock 数据驱动,可逐块检视圆角/阴影/字阶/间距的一致性。

### 完整看板

:::demo
```html
<div class="rumo-dash" style="display: flex; flex-direction: column; gap: 16px;">

  <div class="rumo-panel" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
    <div>
      <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">总览</div>
      <div style="font-size: var(--rumo-text-h3-size); line-height: var(--rumo-text-h3-lh); font-weight: var(--rumo-text-h3-weight);">用量看板</div>
    </div>
    <rumo-date-range-preset v-model="range" />
  </div>

  <rumo-stat-grid :columns="4">
    <rumo-stat-tile v-for="tile in tiles" :key="tile.label" :label="tile.label" :value="tile.value" :delta="tile.delta" :tone="tile.tone" :hint="tile.hint" />
  </rumo-stat-grid>

  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
    <div class="rumo-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-weight: 600;">调用趋势</div>
        <rumo-button size="mini" variant="ghost" @click="zoomVisible = true">放大</rumo-button>
      </div>
      <rumo-trend-chart :series="trendSeries" :labels="trendLabels" :height="200" :zoomable="false" :formatter="fmtNum" />
    </div>
    <div class="rumo-panel">
      <div style="font-weight: 600; margin-bottom: 12px;">来源 Top</div>
      <rumo-rank-list :items="rankItems" :max="5" :value-text="fmtValueText" />
    </div>
  </div>

  <div class="rumo-panel">
    <div style="font-weight: 600; margin-bottom: 12px;">活跃热力</div>
    <rumo-heatmap :cells="heatCells" :format-tooltip="fmtHeat" />
  </div>

  <div class="rumo-panel">
    <div style="font-weight: 600; margin-bottom: 12px;">来源分布</div>
    <rumo-stack-bar :segments="stackSegments" :formatter="fmtStack" />
  </div>

  <div class="rumo-panel">
    <div style="font-weight: 600; margin-bottom: 12px;">配额</div>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <rumo-quota-bar label="主配额" :percent="42" reset-at="10 月 8 日 00:00 重置" />
      <rumo-quota-bar label="高峰时段" :percent="88" :pace-percent="70" reset-at="每日 00:00 重置" />
      <rumo-quota-bar label="试用额度" :percent="12" mode="remain" reset-at="10 月 15 日到期" />
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
    <div class="rumo-panel">
      <rumo-breakdown-list :rows="breakdownRows" :default-expand-all="false" />
    </div>
    <rumo-ratio-card title="终端占比" :items="ratioItems" />
    <rumo-insight-card title="本周要点" :insights="insights" />
  </div>

  <rumo-trend-zoom :visible.sync="zoomVisible" :series="trendSeries" :labels="trendLabels" :formatter="fmtNum" title="调用趋势(放大)" />
</div>
<script>
  export default {
    data() {
      var today = new Date();
      function fmt(d) {
        var m = d.getMonth() + 1;
        var day = d.getDate();
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      }
      var heatCells = [];
      for (var i = 0; i < 84; i++) {
        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (83 - i));
        heatCells.push({ date: fmt(d), value: [0, 2, 5, 12, 3, 8, 20, 1, 6, 15, 9, 0, 4, 11][i % 14] });
      }
      var to = fmt(today);
      var from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
      return {
        zoomVisible: false,
        range: [fmt(from), to],
        tiles: [
          { label: '总调用量', value: '128,450', delta: '+12.4%', tone: 'success', hint: '近 7 天合计' },
          { label: '活跃项目', value: '23', delta: '+2', tone: 'success', hint: '有调用的项目数' },
          { label: '成功率', value: '99.2%', delta: '-0.3%', tone: 'danger', hint: '成功请求占比' },
          { label: '平均延迟', value: '1.8s', delta: '-0.2s', tone: 'success', hint: 'P50 端到端' }
        ],
        trendSeries: [1280, 1420, null, 1650, 1590, 1820, 2010],
        trendLabels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', '今天'],
        rankItems: [
          { name: '桌面端', value: 52400 },
          { name: '命令行', value: 38200 },
          { name: '网页', value: 24100 },
          { name: '插件', value: 9800 },
          { name: '其他', value: 3950 }
        ],
        heatCells: heatCells,
        stackSegments: [
          { label: '桌面端', value: 52400 },
          { label: '命令行', value: 38200 },
          { label: '网页', value: 24100 },
          { label: '其他', value: 13750 }
        ],
        breakdownRows: [
          { label: '输入', value: 62000, percent: 48.2 },
          { label: '输出', value: 24000, percent: 18.7 },
          {
            label: '缓存', value: 42450, percent: 33.1,
            children: [
              { label: '缓存读取', value: 38000 },
              { label: '缓存写入', value: 4450 }
            ]
          }
        ],
        ratioItems: [
          { label: 'macOS', value: 62000 },
          { label: 'Windows', value: 41000 },
          { label: 'Linux', value: 25450 }
        ],
        insights: [
          { label: '峰值时段', value: '14:00–16:00', delta: '稳定', tone: 'success' },
          { label: '最活跃项目', value: '示例项目 A', delta: '+18%', tone: 'success' },
          { label: '异常请求', value: '326', delta: '+41', tone: 'danger' }
        ]
      };
    },
    methods: {
      fmtNum(value) {
        return value == null ? '—' : Number(value).toLocaleString();
      },
      fmtValueText(item) {
        return Number(item.value).toLocaleString();
      },
      fmtHeat(date, value) {
        return date + ': ' + value;
      },
      fmtStack(seg, percent) {
        return Number(seg.value).toLocaleString() + ' (' + percent.toFixed(1) + '%)';
      }
    }
  };
</script>
```
:::

### 区块与组件对照

| 看板区块 | 组件 |
|---|---|
| 区间切换 | DateRangePreset |
| 统计磁贴 | StatTile / StatGrid |
| 趋势图 | TrendChart / TrendZoom |
| 来源榜单 | RankList |
| 活跃热力 | Heatmap |
| 分布条 | StackBar |
| 配额 | QuotaBar |
| 明细列表 | BreakdownList |
| 占比卡 | RatioCard |
| 要点卡 | InsightCard |
| 可拖卡片 | SortableCard |
