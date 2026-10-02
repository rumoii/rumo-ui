[toc]

## Heatmap 日历热力图

Dash 数据可视化组件:按周列排布的日历热力图,色阶分 5 档(无数据/低/中/高/峰值),档位按数值分位数自动切分,可由 `palette` 覆盖。日格区间取 `cells` 的最小/最大日期,中间缺日按无数据档渲染。

### 基础用法

`cells` 传入 `{ date, value }` 数组;日期为 `YYYY-MM-DD`。横向可滚动,初始定位到最近一周。
:::demo
```html
<div class="rumo-dash">
  <rumo-heatmap :cells="cells" />
</div>
<script>
  function buildDemoCells() {
    var out = [];
    var today = new Date();
    for (var i = 140; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      var date = y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      var seed = day * 3 + m * 7 + i;
      out.push({ date: date, value: seed % 5 === 0 ? 0 : (seed % 37) + 1 });
    }
    return out;
  }

  export default {
    data: function() {
      return { cells: buildDemoCells() };
    }
  };
</script>
```
:::

### 自定义色阶与提示

`palette` 覆盖 5 档色;`format-tooltip` 控制悬停文案;标题位用 `title` 插槽。
:::demo
```html
<div class="rumo-dash">
  <rumo-heatmap :cells="cells" :format-tooltip="tip">
    <template slot="title">近 3 个月数值分布</template>
  </rumo-heatmap>
  <rumo-heatmap
    style="margin-top: 16px;"
    :cells="cells"
    :palette="palette"
    :format-tooltip="tip"
    :month-labels="false"
  />
</div>
<script>
  function buildDemoCells() {
    var out = [];
    var today = new Date();
    for (var i = 90; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      var date = y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      var seed = day * 5 + i * 2;
      out.push({ date: date, value: seed % 6 === 0 ? 0 : (seed % 53) + 1 });
    }
    return out;
  }

  export default {
    data: function() {
      return {
        cells: buildDemoCells(),
        palette: [
          'var(--rumo-c-neutral-100, #eff2f9)',
          'var(--rumo-c-series-3, #14b8a6)',
          'var(--rumo-c-series-2, #3b82f6)',
          'var(--rumo-c-series-1, #8b5cf6)',
          'var(--rumo-c-accent-800, #4f38a2)'
        ]
      };
    },
    methods: {
      tip: function(date, value) {
        return date + ' · ' + value + ' 次';
      }
    }
  };
</script>
```
:::

### 周起始、尺寸与标签

`week-starts-on` 支持周日/周一开始;`cell-size` / `gap` 接受像素数字或任意 CSS 长度;`weekday-labels` 只保留一/三/五三行标签。
:::demo
```html
<div class="rumo-dash">
  <rumo-heatmap
    :cells="cells"
    :week-starts-on="0"
    :cell-size="14"
    :gap="4"
    :weekday-labels="false"
  />
</div>
<script>
  function buildDemoCells() {
    var out = [];
    var today = new Date();
    for (var i = 60; i >= 0; i--) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var day = d.getDate();
      var date = y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      out.push({ date: date, value: (day + i) % 4 === 0 ? 0 : ((day * 11 + i) % 29) + 1 });
    }
    return out;
  }

  export default {
    data: function() {
      return { cells: buildDemoCells() };
    }
  };
</script>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| cells | 日格数据,项含 `date`(`YYYY-MM-DD`) / `value` | array | — | [] |
| week-starts-on | 每周起始日,0=周日、1=周一 | number | 0 / 1 | 1 |
| palette | 5 档色阶(无数据/低/中/高/峰值) | array | — | accent-50/200/400/600/800 |
| cell-size | 日格尺寸,数字按 px | number / string | — | 12 |
| gap | 日格间距,数字按 px | number / string | — | 3 |
| format-tooltip | 悬停文案 `(date, value) => string` | function | — | `date: value` |
| month-labels | 是否显示月标签 | boolean | — | true |
| weekday-labels | 是否显示一/三/五星期标签 | boolean | — | true |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| cell-click | 点击某日格时触发 | `{ date, value }` |

### Slots
| 名称 | 说明 |
|---|---|
| title | 热力图上方标题 |
