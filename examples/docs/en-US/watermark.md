## Watermark

Add tamper-resistant watermarks to a page or region. Supports text and image watermarks, multi-line text, and auto-restores when the watermark node is deleted or modified.

### Text watermark

Use `content` for the watermark text and `gap` for tiling spacing.

:::demo

```html
<div>
  <rumo-watermark content="rumo-ui" :gap="[120, 80]" style="height: 240px">
    <div style="padding: 20px; height: 200px;">Page content</div>
  </rumo-watermark>
</div>
```

:::

### Multi-line and font style

Pass an array to `content` for multi-line text; use `font` to customize color, size, rotation, etc.

:::demo

```html
<div>
  <rumo-watermark
    :content="['Internal', 'Confidential']"
    :rotate="-30"
    :font="{ color: 'rgba(120, 80, 220, .25)', fontSize: 20 }"
    style="height: 240px"
  >
    <div style="padding: 20px; height: 200px;">Multi-line watermark</div>
  </rumo-watermark>
</div>
```

:::

### Image watermark

Use `image` for an image source (base64 supported). It takes priority over `content`.

:::demo

```html
<div>
  <rumo-watermark
    image="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHRleHQgeD0iNSIgeT0iMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM4NTZBRjkiPkxvZ288L3RleHQ+PC9zdmc+"
    :gap="[100, 100]"
    style="height: 240px"
  >
    <div style="padding: 20px; height: 200px;">Image watermark</div>
  </rumo-watermark>
</div>
```

:::

### Tamper resistance

When the watermark node is deleted or its style modified, the component re-renders via MutationObserver (try deleting it from the console).

:::demo

```html
<div>
  <rumo-watermark content="try to delete me" :gap="[140, 60]" style="height: 200px">
    <div style="padding: 20px; height: 160px;">
      The watermark DOM auto-restores after deletion (see console).
    </div>
  </rumo-watermark>
</div>
```

:::

### Watermark Attributes

| Attribute | Description                                          | Type              | Accepted Values | Default                    |
| --------- | ---------------------------------------------------- | ----------------- | --------------- | -------------------------- |
| content   | watermark text content (array for multi-line)        | string / string[] | —               | rumo-ui                    |
| image     | image source (base64 ok), takes priority over content| string            | —               | —                          |
| width     | unit width of the watermark                          | number            | —               | 120 for image / auto text  |
| height    | unit height of the watermark                         | number            | —               | 64 for image / auto text   |
| rotate    | rotation angle                                       | number            | —               | -22                        |
| z-index   | z-index of the watermark layer                       | number            | —               | 9                          |
| font      | text style (see below)                               | object            | —               | —                          |
| gap       | tiling spacing `[horizontal, vertical]`              | number[]          | —               | [100, 100]                 |
| offset    | offset from container's top-left, defaults to gap/2  | number[]          | —               | —                          |

### font object

| Attribute   | Description       | Type   | Default            |
| ----------- | ----------------- | ------ | ------------------ |
| color       | text color        | string | rgba(0,0,0,.15)    |
| fontSize    | font size         | number | 16                 |
| fontWeight  | font weight       | string | normal             |
| fontStyle   | font style        | string | normal             |
| fontFamily  | font family       | string | sans-serif         |
| fontGap     | line gap          | number | 3                  |
| textAlign   | text alignment    | string | center             |
| textBaseline| text baseline     | string | hanging            |

### Slots

| Name    | Description                     |
| ------- | ------------------------------- |
| default | content covered by the watermark|
