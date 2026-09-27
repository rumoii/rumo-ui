## Text

Unified text typography with semantic colors, sizes, ellipsis and line clamping. Truncated text automatically carries the full content as `title`.

### Basic usage

:::demo

```html
<rumo-text>Default text</rumo-text>
```

:::

### Types

Use `type` for semantic colors.

:::demo

```html
<div>
  <rumo-text type="primary">Primary</rumo-text>
  <rumo-text type="success">Success</rumo-text>
  <rumo-text type="warning">Warning</rumo-text>
  <rumo-text type="danger">Danger</rumo-text>
  <rumo-text type="info">Info</rumo-text>
</div>
```

:::

### Sizes

`size` accepts `large` / `default` / `small`; falls back to the form size.

:::demo

```html
<div>
  <rumo-text size="large">Large</rumo-text>
  <rumo-text>Default</rumo-text>
  <rumo-text size="small">Small</rumo-text>
</div>
```

:::

### Ellipsis

`truncated` for single-line ellipsis; overflow shows the full text in `title`.

:::demo

```html
<div style="width: 240px;">
  <rumo-text truncated>
    This is a very long text that will be ellipsised when it overflows the container width. Hover to see the full content.
  </rumo-text>
</div>
```

:::

### Line clamp

`line-clamp` limits the maximum number of lines.

:::demo

```html
<div style="width: 240px;">
  <rumo-text :line-clamp="2">
    This is a very long text that will be clamped to the given number of lines. Line clamping is based on -webkit-line-clamp; overflow also carries a title tooltip automatically.
  </rumo-text>
</div>
```

:::

### Text Attributes

| Attribute   | Description                            | Type    | Accepted Values                          | Default |
| ----------- | -------------------------------------- | ------- | ---------------------------------------- | ------- |
| type        | text type                              | string  | primary / success / warning / danger / info | —    |
| size        | text size (falls back to the form size)| string  | large / default / small                  | —       |
| truncated   | single-line ellipsis                   | boolean | —                                        | false   |
| line-clamp  | maximum lines                          | number / string | —                              | —       |
| tag         | custom element tag                     | string  | —                                        | span    |

### Slots

| Name    | Description |
| ------- | ----------- |
| default | text content|
