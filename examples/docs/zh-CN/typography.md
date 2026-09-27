## Typography 字体

我们对字体进行统一规范，力求在各个操作系统下都有最佳展示效果。

### 中文字体
:::demo
```html
<div class="demo-typo-box typo-PingFang">
  某某科技
  <div class="name">
    PingFang SC<br>
    IOS/Mac 优先
  </div>
</div>
<div class="demo-typo-box typo-Hiragino">
  某某科技
  <div class="name">
    Hiragino Sans GB<br>
    备用文字
  </div>
</div>
<div class="demo-typo-box typo-Microsoft">
  某某科技
  <div class="name">
    Microsoft YaHei<br>
    次级备用文字
  </div>
</div>
```
:::

### 英文／数字字体
:::demo
```html
<div class="demo-typo-box demo-en typo-Helvetica-neue">
  Rumo Design
  <div class="name">
    Helvetica Neue<br>
    优先字体
  </div>
</div>
<div class="demo-typo-box demo-en typo-Helvetica">
  Rumo Design
  <div class="name">
    Helvetica<br>
    备用文字
  </div>
</div>
<div class="demo-typo-box demo-en typo-Arial">
  Rumo Design
  <div class="name">
    Arial<br>
    次级备用文字
  </div>
</div>
```
:::
:::tip
#### 字体使用规范
对字体进行了统一规范，力求在不同平台、浏览器下能显示出其最佳的效果。推荐 macOS（iOS） 优先 的策略，在不支持苹方字体的情况，使用备用字体。由于操作系统的不同，导致同样的页面会展现不同字体效果，所以为了保证设计稿统一，必须在设计稿中采用 <strong>苹方</strong> 字体。
:::

```CSS
font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hirgino Sans GB", "Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```
#### 特别说明
我们单独将数字的字体 <span style="color: blue">font-variant-numeric</span> 设置为 <span style="color:green">tabular-nums</span>，使其为等宽字体。


### 字体使用规范
字重的选择同样基于秩序、稳定、克制的原则。多数情况下，只出现 regular 以及 medium 的两种字体重量，分别对应代码中的 400 和 500。在英文字体加粗的情况下会采用 semibold 的字体重量，对应代码中的 600。

<div class="demo-typo-box typo-regular typo-font-weight">
  某某科技
  <div class="name">
    Regular<br>
    400
  </div>
</div>
<div class="demo-typo-box typo-medium typo-font-weight">
  某某科技
  <div class="name">
    Medium<br>
    500
  </div>
</div>
<div class="demo-typo-box typo-semibold typo-font-weight">
  某某科技
  <div class="name">
    Semibold<br>
    600
  </div>
</div>

<table class="demo-typo-size">
  <tbody>
  <tr>
      <td class="desc">字体</td>
      <td class="desc">示例</td>
      <td class="desc">粗细</td>
      <td class="desc">颜色</td>
      <td class="desc">字号</td>
      <td class="desc">行高</td>
      <td class="desc">应用场景</td>
    </tr>
    <tr>
      <td class="desc">特殊字段</td>
      <td class="special text-color typo-semibold">特殊标题</td>
      <td class="desc">Semibold 600</td>
      <td class="desc">#55677d</td></td>
      <td class="desc">24px</td>
      <td class="desc">32px</td>
      <td class="desc">主要应用于突出展示型文字</td>
    </tr>
    <tr>
      <td class="desc">特殊字段</td>
      <td class="h1 text-color typo-semibold">LOGO名称</td>
      <td class="desc">Semibold 600</td>
      <td class="desc">#55677d</td></td>
      <td class="desc">20px</td>
      <td class="desc">28px</td>
      <td class="desc">主要应用于LOGO文字</td>
    </tr>
    <tr>
      <td class="desc">一级主标题</td>
      <td class="desc light-text-color typo-semibold">我是标题</td>
      <td class="desc">Medium 500</td>
      <td class="desc">#55677d</td></td>
      <td class="desc">18px</td>
      <td class="desc">24px</td>
      <td class="desc">主要应用于一级导航栏文字，部分按钮文字，页面标题</td>
    </tr>
    <tr>
      <td class="desc">二级标题</td>
      <td class="desc text-color typo-medium">我是标题</td>
      <td class="desc">Semibold 500</td>
      <td class="desc">#55677d</td></td>
      <td class="desc">16px</td>
      <td class="desc">24px</td>
      <td class="desc">主要应用于重要的内容标题、模块划分、弹框标题</td>
    </tr>
    <tr>
      <td class="desc">二级次标题</td>
      <td class="desc form-text-color typo-medium">我是二级次标题</td>
      <td class="desc">Medium 500</td>
      <td class="desc">#8090a0</td></td>
      <td class="desc">16px</td>
      <td class="desc">24px</td>
      <td class="desc">主要应用tab</td>
    </tr>
    <tr>
      <td class="desc">次级标题</td>
      <td class="h3 form-text-color typo-medium">我是次级标题</td>
      <td class="desc">Medium 500</td>
      <td class="desc">#8090a0</td></td>
      <td class="desc">14px</td>
      <td class="desc">22px</td>
      <td class="desc">主要应用于表单信息标题</td>
    </tr>
    <tr>
      <td class="desc">副标题</td>
      <td class="h4 form-text-color typo-medium">我是副标题</td>
      <td class="desc">Medium 500</td>
      <td class="desc">#8090a0</td></td>
      <td class="desc">12px</td>
      <td class="desc">20px</td>
      <td class="desc">主要应用于主标题的补充或基础介绍</td>
    </tr>
    <tr>
      <td class="desc">正文</td>
      <td class="h3 text-color typo-medium">我是正文</td>
      <td class="desc">Medium 500</td>
      <td class="desc">#55677d</td></td>
      <td class="desc">14px</td>
      <td class="desc">22px</td>
      <td class="desc">主要应用于主要内容信息，二三级导航栏、区块标题</td>
    </tr>
    <tr>
      <td class="desc">辅助文字</td>
      <td class="h4 aside-text-color typo-regular">我是辅助文字</td>
      <td class="desc">Regular 400</td>
      <td class="desc">#9ea7b4</td></td>
      <td class="desc">12px</td>
      <td class="desc">20px</td>
      <td class="desc">主要应用于注释、表格内容、提示文字、备注性信息</td>
    </tr>
    <tr>
      <td class="desc">失效文字</td>
      <td class="h4 useless-text-color typo-regular">我是失效文字</td>
      <td class="desc">Regular 400</td>
      <td class="desc">#cscbd6</td></td>
      <td class="desc">12px</td>
      <td class="desc">20px</td>
      <td class="desc">主要应用于不可点击文字</td>
    </tr>
    <tr>
      <td class="desc">链接文字</td>
      <td class="h4 link-text-color typo-regular">我是链接文字</td>
      <td class="desc">Regular 400</td>
      <td class="desc">#0091ff</td></td>
      <td class="desc">12px</td>
      <td class="desc">20px</td>
      <td class="desc">主要应用于可点击链接文字</td>
    </tr>
  </tbody>
</table>

<!-- 
### Font-family 代码

```CSS
font-family: Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
```

:::tip
若为深色背景，则标准色 (#0A1D33) 改为白色#FFFFFF。
::: -->

### 颜色使用说明
:::demo
```HTML
<img src="../examples/assets/images/frame/info@2x.png" width="100%"/>
```
:::
