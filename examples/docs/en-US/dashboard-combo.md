[toc]

## Dashboard Composition Example

A full dashboard layout assembled from the Dash component family, serving as the visual acceptance baseline: top range switcher + stat tiles + trend chart + leaderboard + heatmap + distribution bar + quotas + detail/ratio/insight cards. Every block is driven by the same mock data so radius/shadow/type/spacing consistency can be inspected block by block.

### Full dashboard

:::demo
```html
<div class="rumo-dash" style="display: flex; flex-direction: column; gap: 16px;">

  <div class="rumo-panel" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
    <div>
      <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">Overview</div>
      <div style="font-size: var(--rumo-text-h3-size); line-height: var(--rumo-text-h3-lh); font-weight: var(--rumo-text-h3-weight);">Usage dashboard</div>
    </div>
    <rumo-date-range-preset v-model="range" />
  </div>

  <rumo-stat-grid :columns="4">
    <rumo-stat-tile v-for="tile in tiles" :key="tile.label" :label="tile.label" :value="tile.value" :delta="tile.delta" :tone="tile.tone" :hint="tile.hint" />
  </rumo-stat-grid>

  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
    <div class="rumo-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-weight: 600;">Call trend</div>
        <rumo-button size="mini" variant="ghost" @click="zoomVisible = true">Zoom</rumo-button>
      </div>
      <rumo-trend-chart :series="trendSeries" :labels="trendLabels" :height="200" :zoomable="false" :formatter="fmtNum" />
    </div>
    <div class="rumo-panel">
      <div style="font-weight: 600; margin-bottom: 12px;">Top sources</div>
      <rumo-rank-list :items="rankItems" :max="5" :value-text="fmtValueText" />
    </div>
  </div>

  <div class="rumo-panel">
    <div style="font-weight: 600; margin-bottom: 12px;">Activity heatmap</div>
    <rumo-heatmap :cells="heatCells" :format-tooltip="fmtHeat" />
  </div>

  <div class="rumo-panel">
    <div style="font-weight: 600; margin-bottom: 12px;">Source distribution</div>
    <rumo-stack-bar :segments="stackSegments" :formatter="fmtStack" />
  </div>

  <div class="rumo-panel">
    <div style="font-weight: 600; margin-bottom: 12px;">Quotas</div>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <rumo-quota-bar label="Main quota" :percent="42" reset-at="Resets Oct 8 00:00" />
      <rumo-quota-bar label="Peak hours" :percent="88" :pace-percent="70" reset-at="Resets daily 00:00" />
      <rumo-quota-bar label="Trial credit" :percent="12" mode="remain" reset-at="Expires Oct 15" />
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
    <div class="rumo-panel">
      <rumo-breakdown-list :rows="breakdownRows" :default-expand-all="false" />
    </div>
    <rumo-ratio-card title="Platform share" :items="ratioItems" />
    <rumo-insight-card title="This week" :insights="insights" />
  </div>

  <rumo-trend-zoom :visible.sync="zoomVisible" :series="trendSeries" :labels="trendLabels" :formatter="fmtNum" title="Call trend (zoomed)" />
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
          { label: 'Total calls', value: '128,450', delta: '+12.4%', tone: 'success', hint: 'Last 7 days combined' },
          { label: 'Active projects', value: '23', delta: '+2', tone: 'success', hint: 'Projects with calls' },
          { label: 'Success rate', value: '99.2%', delta: '-0.3%', tone: 'danger', hint: 'Successful requests' },
          { label: 'P50 latency', value: '1.8s', delta: '-0.2s', tone: 'success', hint: 'End-to-end median' }
        ],
        trendSeries: [1280, 1420, null, 1650, 1590, 1820, 2010],
        trendLabels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'],
        rankItems: [
          { name: 'Desktop', value: 52400 },
          { name: 'CLI', value: 38200 },
          { name: 'Web', value: 24100 },
          { name: 'Plugins', value: 9800 },
          { name: 'Others', value: 3950 }
        ],
        heatCells: heatCells,
        stackSegments: [
          { label: 'Desktop', value: 52400 },
          { label: 'CLI', value: 38200 },
          { label: 'Web', value: 24100 },
          { label: 'Others', value: 13750 }
        ],
        breakdownRows: [
          { label: 'Input', value: 62000, percent: 48.2 },
          { label: 'Output', value: 24000, percent: 18.7 },
          {
            label: 'Cache', value: 42450, percent: 33.1,
            children: [
              { label: 'Cache read', value: 38000 },
              { label: 'Cache write', value: 4450 }
            ]
          }
        ],
        ratioItems: [
          { label: 'macOS', value: 62000 },
          { label: 'Windows', value: 41000 },
          { label: 'Linux', value: 25450 }
        ],
        insights: [
          { label: 'Peak hours', value: '14:00–16:00', delta: 'stable', tone: 'success' },
          { label: 'Top project', value: 'Sample project A', delta: '+18%', tone: 'success' },
          { label: 'Failed requests', value: '326', delta: '+41', tone: 'danger' }
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

### Block & component map

| Dashboard block | Component |
|---|---|
| Range switcher | DateRangePreset |
| Stat tiles | StatTile / StatGrid |
| Trend chart | TrendChart / TrendZoom |
| Source leaderboard | RankList |
| Activity heatmap | Heatmap |
| Distribution bar | StackBar |
| Quotas | QuotaBar |
| Detail list | BreakdownList |
| Ratio card | RatioCard |
| Insight card | InsightCard |
| Draggable card | SortableCard |
