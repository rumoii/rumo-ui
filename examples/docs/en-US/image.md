## Image 图片
图片容器，在保留原生img的特性下，支持懒加载，自定义占位、加载失败等

### 基础用法

:::demo 可通过`fit`确定图片如何适应到容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。
```html
<div class="demo-image">
  <div class="block" v-for="fit in fits" :key="fit">
    <span class="demonstration">{{ fit }}</span>
    <rumo-image
      style="width: 100px; height: 100px"
      :src="url"
      :fit="fit"></rumo-image>
  </div>
</div>
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

### 占位内容

:::demo 可通过`slot = placeholder`可自定义占位内容
```html
<div class="demo-image__placeholder">
  <div class="block">
    <span class="demonstration">默认</span>
    <rumo-image :src="src"></rumo-image>
  </div>
  <div class="block">
    <span class="demonstration">自定义</span>
    <rumo-image :src="src">
      <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div>
    </rumo-image>
  </div>
</div>
<script>
  export default {
    data() {
      return {
        src: '../examples/assets/images/avatar-4.jpeg'
      }
    }
  }
</script>

```
:::

### 加载失败

:::demo 可通过`slot = error`可自定义加载失败内容
```html
<div class="demo-image__error">
  <div class="block">
    <span class="demonstration">默认</span>
    <rumo-image></rumo-image>
  </div>
  <div class="block">
    <span class="demonstration">自定义</span>
    <rumo-image>
      <div slot="error" class="image-slot">
        <i class="rumo-icons icon-warning-circle-o rumo-icons-24"></i>
      </div>
    </rumo-image>
  </div>
</div>
```
:::

### 懒加载

:::demo 可通过`lazy`开启懒加载功能，当图片滚动到可视范围内才会加载。可通过`scroll-container`来设置滚动容器，若未定义，则为最近一个`overflow`值为`auto`或`scroll`的父元素。
```html
<div class="demo-image__lazy">
  <rumo-image v-for="url in urls" :key="url" :src="url" lazy></rumo-image>
</div>
<script>
  export default {
    data() {
      return {
        urls: [
          '../examples/assets/images/rumo-ui-logo.png',
          '../examples/assets/images/rumo-demo.jpeg',
          '../examples/assets/images/hamburger.png',
          '../examples/assets/images/avatar-4.jpeg',
          '../examples/assets/images/web.png'
        ]
      }
    }
  }
</script>

```
:::

### Attributes
| preview-src-list | Image preview list for preview feature | array | — | [] |
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| src | 图片源，同原生 | string | — | - |
| fit | 确定图片如何适应容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) | string | fill / contain / cover / none / scale-down | - |
| alt | 原生 alt | string | - | - |
| referrer-policy | 原生 referrerPolicy | string | - | - |
| lazy | 是否开启懒加载 | boolean | — | false |
| scroll-container | 开启懒加载后，监听 scroll 事件的容器 | string / HTMLElement | — | 最近一个 overflow 值为 auto 或 scroll 的父元素 |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| load | 图片加载成功触发 | (e: Event) |
| error | 图片加载失败触发 | (e: Error) |

### Slots
| 名称    | 说明         |
|---------|-------------|
| placeholder | 图片未加载的占位内容 |
| error | 加载失败的内容 |


