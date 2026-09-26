## Frame 框架布局规范

### 盒子规范
:::demo
```html
<img src="../examples/assets/images/frame/box-rule@2x" style="width: 500px;"/>
```
:::

:::tip
#### 盒子说明
1. Element可以是一个按钮，一段文本，一张图片或者一个表格等；
2. Margin是相邻两个盒子之间的距离，原则上是<span style="color: #e3614a">16px</span>，可根据实际情况酌情处理；
3. Padding内边距遵循 <span style="color: #e3614a">8n 此处n为大于0的正整数，即n=1,2,3...</span> 原则。
:::

### 对齐规范

#### 文字类右对齐

当页面的字段或段落较短、较散时，需要确定一个同意的视觉起点，因此我们建议文案类统一使用左对齐的方式。

:::demo 
```html
<img src="../examples/assets/images/frame/text-align@2x.png" width="100%"/>
```
:::

#### 数字类右对齐

为了快速对比数值大小，我们采用小数点对齐，并保留相同位数的有效数值。
:::demo
```html
<img src="../examples/assets/images/frame/num-align@2x.png" style="width:100%;" />
```
:::

#### 表单类对齐

文案和输入框都分别向中间间距对齐能让内容锁定在一定范围内，让用户眼球顺着间距的视觉流，就能找到所有填写项，从而提高填写效率。

:::demo
```html
<img src="../examples/assets/images/frame/form-align@2x.png" style="width: 100%;" />
```
:::

### 标准布局样式
:::demo
```html
<div class="demo-basic-frame">
  <rumo-container>
    <rumo-aside width="60px"></rumo-aside>
    <rumo-main>
      <p style="font-size: 16px;color: #5e6d82;line-height: 2.5em;">
        左侧导航<br>展开初始布局样式
      </p>
    </rumo-main>
  </rumo-container>

  <rumo-container>
    <rumo-aside width="60px"></rumo-aside>
    <rumo-container>
      <rumo-aside width="60px"></rumo-aside>
      <rumo-main></rumo-main>
    </rumo-container>
  </rumo-container>
</div>
<div class="demo-basic-frame">
  <rumo-container>
    <rumo-aside width="20px"></rumo-aside>
    <rumo-main>
      <p style="font-size: 16px;color: #5e6d82;line-height: 2.5em;">
        左侧导航<br>收缩初始布局样式
      </p>
    </rumo-main>
  </rumo-container>

  <rumo-container>
    <rumo-aside width="20px"></rumo-aside>
    <rumo-container>
      <rumo-aside width="60px"></rumo-aside>
      <rumo-main></rumo-main>
    </rumo-container>
  </rumo-container>
</div>
<div class="demo-basic-frame">
  <rumo-container>
    <rumo-header height="20px"></rumo-header>
    <rumo-main>
      <p style="font-size: 16px;color: #5e6d82;line-height: 2.5em;">
        顶部导航<br>初始布局样式
      </p>
    </rumo-main>
  </rumo-container>

  <rumo-container>
    <rumo-header height="20px"></rumo-header>
    <rumo-container style="border: none;">
      <rumo-aside width="60px" style="border: none;"></rumo-aside>
      <rumo-container style="border: none;">
        <rumo-header height="20px" style="background-color: #E9EEF3;border-left:2px solid #ddd;"></rumo-header>
        <rumo-container>
          <rumo-aside width="60px"></rumo-aside>  
          <rumo-main></rumo-main>
        </rumo-container>
      </rumo-container>
    </rumo-container>
  </rumo-container>
</div>

<style scoped>
.demo-frame {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
  &>.rumo-container {
    height: 200px;
    line-height: 200px;
    &:first-child {
      margin-right: 15px;
    }
    &:nth-child(2) {
      margin-left: 15px;
    }
    &>.rumo-main {
      border: 5px solid #ddd;
    }
    .rumo-container {
      border: 5px solid #ddd;
      .rumo-aside {
        background-color: #E9EEF3;
        border-right: 5px solid #ddd;
      }
    }
  }
}

.rumo-header {
  background-color: #55677d;
  text-align: center;
  line-height: 60px;
}

.rumo-aside {
  background-color: #55677d;
  text-align: center;
  line-height: 200px;
}

.rumo-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

</style>
```
:::

### 1440*900标准布局说明
:::demo
```html
<img src="../examples/assets/images/frame/frame@2x.png" style="width: 100%;">
```
:::
:::tip
#### 标准布局使用说明
1. 此布局适用于1440*900px。
2. 布局中蓝色区域为固定大小区域，宽度固定不可更改。
3. 粉红色区域为间隔区域，间隔大小固定为16px。
4. 黄色区域为内容区域做自适应处理，根据自适应原理给出最小值。
5. 1280px < 1440布局 < 1920px。
6. 顶部导航：一级导航高度64px，二级导航48px。
:::