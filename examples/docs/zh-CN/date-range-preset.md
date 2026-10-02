[toc]

## DateRangePreset 预设区间

Dash 组件:预设时间区间胶囊(7 天 / 30 天等)+ 自定义区间弹层(复用 DatePicker 的 `daterange`),用于看板时间范围切换。

### 基础用法

`presets` 定义预设(`days` 为截至今天的滚动窗口,或 `from`/`to` 固定区间);`value` 为 `[from, to]`(`YYYY-MM-DD`),支持 `v-model`。
:::demo
```html
<div class="rumo-dash">
  <rumo-date-range-preset v-model="range" @change="onChange" />
  <div class="rumo-num" style="margin-top: 12px; font-size: var(--rumo-text-caption-size);">
    {{ range[0] }} ~ {{ range[1] }}
  </div>
</div>
<script>
  export default {
    data() {
      var to = new Date();
      var from = new Date();
      from.setDate(from.getDate() - 6);
      function fmt(d) {
        var m = d.getMonth() + 1;
        var day = d.getDate();
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
      }
      return {
        range: [fmt(from), fmt(to)]
      };
    },
    methods: {
      onChange(payload) {
        this.$message && this.$message('切换到 ' + payload.from + ' ~ ' + payload.to + ' (' + payload.preset + ')');
      }
    }
  };
</script>
```
:::

### 自定义预设与文案

预设可传固定区间;按钮文案均可定制。
:::demo
```html
<div class="rumo-dash">
  <rumo-date-range-preset
    v-model="range"
    :presets="[
      { key: 'today', label: '今天', days: 1 },
      { key: '7d', label: '近 7 天', days: 7 },
      { key: 'month', label: '本月', from: monthFrom, to: monthTo }
    ]"
    custom-label="自定义"
    cancel-text="取消"
    apply-text="应用"
  />
</div>
<script>
  export default {
    computed: {
      monthFrom: function() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-01';
      },
      monthTo: function() {
        var d = new Date();
        var m = d.getMonth() + 1;
        return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();
      }
    },
    data: function() {
      return { range: [] };
    }
  };
</script>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| presets | 预设列表,项含 `label` 与 `days?` / `from?`+`to?` | array | — | 近 7/30/90 天 |
| value | 选中区间 `[from, to]`(YYYY-MM-DD),支持 v-model | array | — | [] |
| custom-label | 自定义区间按钮文案 | string | — | Custom |
| cancel-text / apply-text | 弹层按钮文案 | string | — | Cancel / Apply |
| active-key | 强制高亮的预设 key,缺省按 value 反推 | string | — | — |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| change | 选择变化时触发 | `{ from, to, preset }` |
| preset-click | 点击预设或应用自定义时触发 | preset key |
