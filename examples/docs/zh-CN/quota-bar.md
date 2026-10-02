[toc]

## QuotaBar 配额进度条

Dash 数据可视化组件:配额/限额用量条。标签行左名称、右数值与百分比,下方圆角进度条;支持重置时间文案、配速标记与阈值变色。`mode="used"` 展示已用量,`mode="remain"` 反向展示剩余量。

### 基础用法

`percent` 为 0-100 的已用比例;`value` 显示在右侧,`resetAt` 传入已格式化的重置文案。
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    label="5h 用量"
    :value="12800"
    :percent="42"
    reset-at="3h"
  />
</div>
```
:::

### 接近用尽

阈值色按用量风险自动切换:`<80` success、`80-95` warning、`>95` danger。也可用 `tone` 显式覆盖。
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    label="周额度"
    value-text="9.6k / 10k"
    :percent="88"
    reset-at="2d"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    label="团队池"
    :value="2"
    :percent="97"
    reset-at="40m"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    label="自定义色"
    :percent="50"
    tone="warning"
    :show-percent="false"
  />
</div>
```
:::

### 配速标记

`pace-percent` 在轨道上打竖线刻痕,提示按当前速度到重置时的位置;填充越过标记时刻痕转为 danger 色。
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    label="5h 用量 · 落后配速"
    :value="18200"
    :percent="38"
    :pace-percent="55"
    reset-at="2h"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    label="5h 用量 · 超前配速"
    :value="41000"
    :percent="82"
    :pace-percent="61"
    reset-at="2h"
  />
</div>
```
:::

### remain 模式

`mode="remain"` 时 `percent` 表示剩余比例,填充越高剩余越多;阈值按剩余量翻转(剩余越少越危险)。
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    mode="remain"
    label="月度额度剩余"
    :value="14500"
    :percent="35"
    reset-at="12d"
  />
  <rumo-quota-bar
    style="margin-top: 12px;"
    mode="remain"
    label="周额度剩余"
    :value="400"
    :percent="8"
    :pace-percent="12"
    reset-at="1d"
  />
</div>
```
:::

### 插槽

`label` 插槽自定义左侧标签,`actions` 插槽在右侧追加操作位;点击整条触发 `click`。
:::demo
```html
<div class="rumo-dash">
  <rumo-quota-bar
    :percent="64"
    :value="6400"
    reset-at="5h"
    @click="onClick"
  >
    <template slot="label">
      <strong>API 额度</strong>
    </template>
    <template slot="actions">
      <span style="cursor: pointer; color: var(--rumo-c-accent, #856AF9);">详情</span>
    </template>
  </rumo-quota-bar>
</div>
<script>
  export default {
    methods: {
      onClick() {
        this.$message && this.$message('quota-bar click');
      }
    }
  };
</script>
```
:::

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| label | 左侧标签文案 | string | — | '' |
| value | 右侧数值,与 `mode` 语义一致(已用/剩余) | number / string | — | null |
| value-text | 右侧数值文案,缺省显示 `value` | string | — | '' |
| percent | 展示百分比 0-100;used 为已用比例,remain 为剩余比例 | number | — | 0 |
| mode | 填充语义 | string | used / remain | used |
| reset-at | 重置时间文案,已格式化字符串,空则不显示 | string | — | '' |
| pace-percent | 配速标记位置 0-100,null 不显示 | number | — | null |
| tone | 阈值色,缺省按用量风险自动(&lt;80 success,80-95 warning,&gt;95 danger) | string | success / warning / danger | '' |
| show-percent | 是否显示百分比 | boolean | — | true |

### Events
| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| click | 点击整条时触发 | 原生 click 事件对象 |

### Slots
| 名称 | 说明 |
|---|---|
| label | 左侧标签内容,缺省用 `label` 属性 |
| actions | 标签行右侧追加的操作位 |
