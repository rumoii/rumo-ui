[toc]

## Card 卡片
将信息聚合在卡片容器中展示。

### 基础用法


包含标题，内容和操作。

:::demo Card 组件包括`header`和`body`部分，`header`部分需要有显式具名 slot 分发，同时也是可选的。
```html
<rumo-card class="box-card">
  <div slot="header" class="clearfix">
    <span>卡片名称</span>
    <rumo-button style="float: right; padding: 3px 0" text>操作按钮</rumo-button>
  </div>
  <div v-for="o in 4" :key="o" class="text item">
    {{'列表内容 ' + o }}
  </div>
</rumo-card>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
```
:::

### 简单卡片

卡片可以只有内容区域。

:::demo
```html
<rumo-card class="box-card">
  <div v-for="o in 4" :key="o" class="text item">
    {{'列表内容 ' + o }}
  </div>
</rumo-card>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
```
:::

### 带图片

可配置定义更丰富的内容展示。

:::demo 配置`body-style`属性来自定义`body`部分的`style`，我们还使用了布局组件。
```html
<rumo-row>
  <rumo-col :span="8" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 2 : 0">
    <rumo-card :body-style="{ padding: '0px' }">
      <img src="https://picsum.photos/600/400" class="image">
      <div style="padding: 14px;">
        <span>好吃的汉堡</span>
        <div class="bottom clearfix">
          <time class="time">{{ currentDate }}</time>
          <rumo-button text class="button">操作按钮</rumo-button>
        </div>
      </div>
    </rumo-card>
  </rumo-col>
</rumo-row>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    };
  }
}
</script>
```
:::

### 卡片阴影

可对阴影的显示进行配置。

:::demo 通过`shadow`属性设置卡片阴影出现的时机：`always`、`hover`或`never`。
```html
<rumo-row :gutter="12">
  <rumo-col :span="8">
    <rumo-card shadow="always">
      总是显示
    </rumo-card>
  </rumo-col>
  <rumo-col :span="8">
    <rumo-card shadow="hover">
      鼠标悬浮时显示
    </rumo-card>
  </rumo-col>
  <rumo-col :span="8">
    <rumo-card shadow="never">
      从不显示
    </rumo-card>
  </rumo-col>
</rumo-row>
```
:::

### Dash 交互与内边距

`interactive` 提供悬停反馈(边框变深 + 弱阴影,150ms 过渡);`padding` 自定义卡体内边距,数字按 px 计,字符串原样使用。卡片是独立信息单元,**不嵌套卡片**。未设置这两个属性时,卡片行为与外观不变。
:::demo
```html
<div class="rumo-dash">
  <rumo-row :gutter="12">
    <rumo-col :span="8">
      <rumo-card interactive>
        <div class="dash-card-title">可交互卡片</div>
        <div class="dash-card-text">悬停查看边框与阴影反馈</div>
      </rumo-card>
    </rumo-col>
    <rumo-col :span="8">
      <rumo-card interactive>
        <div class="dash-card-title">另一张卡片</div>
        <div class="dash-card-text">并排展示,不要互相嵌套</div>
      </rumo-card>
    </rumo-col>
    <rumo-col :span="8">
      <rumo-card interactive>
        <div class="dash-card-title">第三张卡片</div>
        <div class="dash-card-text">保持信息单元边界清晰</div>
      </rumo-card>
    </rumo-col>
  </rumo-row>
  <rumo-row :gutter="12" style="margin-top: 12px;">
    <rumo-col :span="8">
      <rumo-card :padding="12">
        <div class="dash-card-title">padding=12</div>
        <div class="dash-card-text">数字按 px 解释</div>
      </rumo-card>
    </rumo-col>
    <rumo-col :span="8">
      <rumo-card padding="24px">
        <div class="dash-card-title">padding=24px</div>
        <div class="dash-card-text">字符串原样应用</div>
      </rumo-card>
    </rumo-col>
    <rumo-col :span="8">
      <rumo-card :padding="0">
        <div class="dash-card-title">padding=0</div>
        <div class="dash-card-text">紧凑贴边内容</div>
      </rumo-card>
    </rumo-col>
  </rumo-row>
</div>

<style>
  .dash-card-title {
    font-size: 14px;
    font-weight: 500;
  }

  .dash-card-text {
    margin-top: 8px;
    font-size: 12px;
    color: var(--rumo-c-neutral-500, #6b7184);
  }
</style>
```
:::

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| header | 设置 header，也可以通过 `slot#header` 传入 DOM | string| — | — |
| body-style | 设置 body 的样式| object| — | { padding: '20px' } |
| shadow | 设置阴影显示时机 | string | always / hover / never | always |
| padding | 设置卡体内边距,数字按 px 计 | string / number | — | — |
| interactive | 是否启用悬停反馈(边框变深 + 弱阴影) | boolean | — | false |
