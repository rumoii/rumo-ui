## Avatar 头像

用图标、图片或者字符的形式展示用户或事物信息。

### 基本用法

通过 `shape` 和 `size` 设置头像的形状和大小。

:::demo
```html
<template>
  <rumo-row class="demo-avatar demo-basic">
    <rumo-col :span="12">
      <div class="sub-title">circle</div>
      <div class="demo-basic--circle">
        <div class="block"><rumo-avatar :size="50" :src="circleUrl"></rumo-avatar></div>
        <div class="block" v-for="size in sizeList" :key="size">
          <rumo-avatar :size="size" :src="circleUrl"></rumo-avatar>
        </div>
      </div>
    </rumo-col>  
    <rumo-col :span="12">
      <div class="sub-title">square</div>
      <div class="demo-basic--circle">
        <div class="block"><rumo-avatar shape="square" :size="50" :src="squareUrl"></rumo-avatar></div>
        <div class="block" v-for="size in sizeList" :key="size">
          <rumo-avatar shape="square" :size="size" :src="squareUrl"></rumo-avatar>
        </div>
      </div>
    </rumo-col> 
  </rumo-row>
</template>
<script>
  export default {
    data () {
      return {
        circleUrl: "../examples/assets/images/avatar-1.png",
        squareUrl: "../examples/assets/images/avatar-2.png",
        sizeList: ["large", "medium", "small"]
      }
    }
  }
</script>

```
:::

### 展示类型

支持三种类型：图标、图片和字符

:::demo
```html
<template>
  <div class="demo-type">
    <div>
      <rumo-avatar icon="icon-user rumo-icons-18"></rumo-avatar>
    </div>
    <div>
      <rumo-avatar src="../examples/assets/images/avatar-5.png"></rumo-avatar>
    </div>
    <div>
      <rumo-avatar> user </rumo-avatar>
    </div>
  </div>
</template>
```
:::

### 图片加载失败的 fallback 行为

当展示类型为图片的时候，图片加载失败的 fallback 行为

:::demo
```html
<template>
  <div class="demo-type">
    <rumo-avatar :size="60" src="../examples/assets/images/avatar-3.png" @error="errorHandler">
      <img src=""/>
    </rumo-avatar>
  </div>
</template>
<script>
  export default {
    methods: {
      errorHandler() {
        return true
      }
    }
  }
</script>

```
:::

### 图片如何适应容器框

当展示类型为图片的时候，使用 `fit` 属性定义图片如何适应容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。

:::demo
```html
<template>
  <div class="demo-fit">
    <div class="block" v-for="fit in fits" :key="fit">
        <span class="title">{{ fit }}</span>
        <rumo-avatar shape="square" :size="100" :fit="fit" :src="url"></rumo-avatar>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: '../examples/assets/images/avatar-4.jpeg'
      }
    }
  }
</script>

```
:::

### Attributes

| 参数              | 说明                             | 类型            | 可选值 | 默认值 |
| ----------------- | -------------------------------- | --------------- | ------ | ------ |
| icon              | 设置头像的图标类型，参考 Icon 组件   | string          |        |        |
| size              | 设置头像的大小                     | number/string | number / large / medium / small | large  |
| shape             | 设置头像的形状  | string |    circle / square     |   circle  |
| src               | 图片头像的资源地址 | string |        |      |
| srcSet            | 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像 | string |        |      |
| alt               | 描述图像的替换文本 | string |        |      |
| fit               | 当展示类型为图片的时候，设置图片如何适应容器框 | string |    fill / contain / cover / none / scale-down    |   cover   |


### Events

| 事件名 | 说明               | 回调参数 |
| ------ | ------------------ | -------- |
| error  | 图片类头像加载失败的回调， 返回 false 会关闭组件默认的 fallback 行为 |(e: Event)  |

### Slot

| 名称	 | 说明               |  
| ------ | ------------------ | 
| default  | 自定义头像展示内容 |
