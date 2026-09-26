[toc]

## Progress 进度条

用于展示操作进度，告知用户当前状态和预期。

### 线形进度条 — 百分比外显

:::demo Progress 组件设置`percentage`属性即可，表示进度条对应的百分比，**必填**，必须在 0-100。

```html
<rumo-progress :percentage="0"></rumo-progress>
<rumo-progress :percentage="70"></rumo-progress>
<rumo-progress :percentage="80" color="#8e71c7"></rumo-progress>
<rumo-progress :percentage="100" status="success"></rumo-progress>
<rumo-progress :percentage="50" status="exception"></rumo-progress>
```
:::

### 线形进度条 — 百分比内显

百分比不占用额外控件，适用于文件上传等场景。

:::demo Progress 组件可通过 `stroke-width` 属性更改进度条的高度，并可通过 `text-inside` 属性来将进度条描述置于进度条内部。

```html
<rumo-progress :text-inside="true" :stroke-width="18" :percentage="0"></rumo-progress>
<rumo-progress :text-inside="true" :stroke-width="18" :percentage="70"></rumo-progress>
<rumo-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(142, 113, 199, 0.7)"></rumo-progress>
<rumo-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></rumo-progress>
<rumo-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception"></rumo-progress>
```
:::

### 自定义颜色

可以通过 `color` 设置进度条的颜色，`color` 可以接受颜色字符串，函数和数组。

:::demo

```html
<rumo-progress :percentage="percentage" :color="customColor"></rumo-progress>

<rumo-progress :percentage="percentage" :color="customColorMethod"></rumo-progress>

<rumo-progress :percentage="percentage" :color="customColors"></rumo-progress>
<div>
  <rumo-button-group>
    <rumo-button icon="icon-delete rumo-icons-14" @click="decrease"></rumo-button>
    <rumo-button icon="icon-add rumo-icons-14" @click="increase"></rumo-button>
  </rumo-button-group>
</div>

<script>
  export default {
    data() {
      return {
        percentage: 20,
        customColor: '#409eff',
        customColors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ]
      };
    },
    methods: {
      customColorMethod(percentage) {
        if (percentage < 30) {
          return '#909399';
        } else if (percentage < 70) {
          return '#e6a23c';
        } else {
          return '#67c23a';
        }
      },
      increase() {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      },
      decrease() {
        this.percentage -= 10;
        if (this.percentage < 0) {
          this.percentage = 0;
        }
      }
    }
  }
</script>
```
:::

### 环形进度条

:::demo Progress 组件可通过 `type` 属性来指定使用环形进度条，在环形进度条中，还可以通过 `width` 属性来设置其大小。

```html
<rumo-progress type="circle" :percentage="0"></rumo-progress>
<rumo-progress type="circle" :percentage="25"></rumo-progress>
<rumo-progress type="circle" :percentage="80" color="#8e71c7"></rumo-progress>
<rumo-progress type="circle" :percentage="100" status="success"></rumo-progress>
<rumo-progress type="circle" :percentage="50" status="exception"></rumo-progress>
```
:::

### 仪表盘形进度条

:::demo 通过 `type` 属性来指定使用仪表盘形进度条。

```html

<rumo-progress type="dashboard" :percentage="percentage1" :color="colors"></rumo-progress>
<div>
  <rumo-button-group>
    <rumo-button icon="icon-delete rumo-icons-14" @click="decrease1"></rumo-button>
    <rumo-button icon="icon-add rumo-icons-14" @click="increase1"></rumo-button>
  </rumo-button-group>
</div>

<script>
  export default {
    data() {
      return {
        percentage1: 10,
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ]
      };
    },
    methods: {
      increase1() {
        this.percentage1 += 10;
        if (this.percentage1 > 100) {
          this.percentage1 = 100;
        }
      },
      decrease1() {
        this.percentage1 -= 10;
        if (this.percentage1 < 0) {
          this.percentage1 = 0;
        }
      }
    }
  }
</script>
```
:::

### Attributes
| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| **percentage** | **百分比（必填）**   | number          |     0-100          |     0    |
| type          | 进度条类型           | string         | line/circle | line |
| stroke-width  | 进度条的宽度，单位 px | number          | — | 6 |
| text-inside  | 进度条显示文字内置在进度条内（只在 type=line 时可用） | boolean | — | false |
| status  | 进度条当前状态 | string | success/exception | — |
| color  | 进度条颜色（自定义时会覆盖 status 状态颜色） | string | — | — |
| width  | 环形进度条画布宽度（只在 type=circle 时可用） | number |  | 126 |
| show-text  | 是否显示进度条文字内容 | boolean | — | true |
