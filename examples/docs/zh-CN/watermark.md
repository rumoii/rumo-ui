## Watermark 水印

在页面或指定区域上添加防篡改水印,支持文字与图片水印、多行文本,水印节点被删除或修改时会自动恢复。

### 文字水印

使用 `content` 设置水印文字,`gap` 控制平铺间距。

:::demo

```html
<div>
  <rumo-watermark content="rumo-ui" :gap="[120, 80]" style="height: 240px">
    <div style="padding: 20px; height: 200px;">页面内容区域</div>
  </rumo-watermark>
</div>
```

:::

### 多行与文字样式

`content` 传入数组可多行显示,`font` 定制颜色、字号、旋转角等。

:::demo

```html
<div>
  <rumo-watermark
    :content="['内部资料', '请勿外传']"
    :rotate="-30"
    :font="{ color: 'rgba(120, 80, 220, .25)', fontSize: 20 }"
    style="height: 240px"
  >
    <div style="padding: 20px; height: 200px;">多行水印内容</div>
  </rumo-watermark>
</div>
```

:::

### 图片水印

通过 `image` 指定图片(支持 base64),优先级高于 `content`。

:::demo

```html
<div>
  <rumo-watermark
    image="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHRleHQgeD0iNSIgeT0iMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM4NTZBRjkiPkxvZ288L3RleHQ+PC9zdmc+"
    :gap="[100, 100]"
    style="height: 240px"
  >
    <div style="padding: 20px; height: 200px;">图片水印内容</div>
  </rumo-watermark>
</div>
```

:::

### 防篡改

水印节点被删除或样式被修改时,组件会通过 MutationObserver 自动重新渲染(可打开控制台尝试删除水印节点验证)。

:::demo

```html
<div>
  <rumo-watermark content="try to delete me" :gap="[140, 60]" style="height: 200px">
    <div style="padding: 20px; height: 160px;">
      水印 DOM 被删除后会自动恢复(见控制台操作)
    </div>
  </rumo-watermark>
</div>
```

:::

### Watermark Attributes

| 参数     | 说明                                     | 类型               | 可选值 | 默认值                 |
| -------- | ---------------------------------------- | ------------------ | ------ | ---------------------- |
| content  | 水印文字内容(数组为多行)              | string / string[]  | —      | rumo-ui                |
| image    | 图片水印地址(base64 可),优先于 content | string             | —      | —                      |
| width    | 水印单元宽度                             | number             | —      | 图片 120 / 文字按内容  |
| height   | 水印单元高度                             | number             | —      | 图片 64 / 文字按内容   |
| rotate   | 水印旋转角度                             | number             | —      | -22                    |
| z-index  | 水印层 z-index                           | number             | —      | 9                      |
| font     | 文字样式(见下表)                        | object             | —      | —                      |
| gap      | 水印平铺间距 `[水平, 垂直]`            | number[]           | —      | [100, 100]             |
| offset   | 相对容器左上角偏移,默认 gap/2          | number[]           | —      | —                      |

### font 字体对象

| 参数        | 说明                | 类型   | 默认值             |
| ----------- | ------------------- | ------ | ------------------ |
| color       | 文字颜色            | string | rgba(0,0,0,.15)    |
| fontSize    | 文字字号            | number | 16                 |
| fontWeight  | 字重                | string | normal             |
| fontStyle   | 字体样式            | string | normal             |
| fontFamily  | 字体                | string | sans-serif         |
| fontGap     | 多行文字行间距      | number | 3                  |
| textAlign   | 水平对齐            | string | center             |
| textBaseline| 垂直基线            | string | hanging            |

### Slots

| 名称    | 说明                 |
| ------- | -------------------- |
| default | 需要覆盖水印的内容区 |
