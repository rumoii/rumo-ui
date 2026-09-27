## Space

Set spacing between components. Supports horizontal/vertical direction, custom sizes, wrapping and fill layout.

### Basic usage

Horizontal spacing between adjacent components with the `small` preset.

:::demo

```html
<rumo-space>
  <rumo-button>Button 1</rumo-button>
  <rumo-button>Button 2</rumo-button>
  <rumo-button>Button 3</rumo-button>
</rumo-space>
```

:::

### Vertical direction

Use `direction` to set the layout direction.

:::demo

```html
<rumo-space direction="vertical">
  <rumo-button>Button 1</rumo-button>
  <rumo-button>Button 2</rumo-button>
  <rumo-button>Button 3</rumo-button>
</rumo-space>
```

:::

### Custom size

`size` accepts the presets `small` / `default` / `large`, a number (px) or an `[horizontal, vertical]` array.

:::demo

```html
<rumo-space :size="32">
  <rumo-button>32px gap</rumo-button>
  <rumo-button>32px gap</rumo-button>
</rumo-space>
```

:::

### Wrapping

With `wrap` enabled, items wrap onto new lines when space runs out.

:::demo

```html
<rumo-space wrap :size="[16, 16]" style="width: 300px">
  <rumo-button v-for="i in 8" :key="i">Button {{ i }}</rumo-button>
</rumo-space>
```

:::

### Fill container

`fill` stretches items to fill the container; `fillRatio` controls each item's minimum width ratio.

:::demo

```html
<rumo-space fill style="width: 480px">
  <rumo-button style="width: 120px">Fixed</rumo-button>
  <rumo-button>Flexible</rumo-button>
  <rumo-button>Flexible</rumo-button>
</rumo-space>
```

:::

### Spacer

Use the `spacer` prop or slot to insert content between adjacent items.

:::demo

```html
<rumo-space spacer="|">
  <span>Home</span>
  <span>List</span>
  <span>Detail</span>
</rumo-space>
```

:::

### Space Attributes

| Attribute | Description                                          | Type                       | Accepted Values                   | Default      |
| --------- | ---------------------------------------------------- | -------------------------- | --------------------------------- | ------------ |
| direction | placement direction                                  | string                     | horizontal / vertical             | horizontal   |
| alignment | alignment of items (align-items)                     | string                     | flex-start / center / flex-end... | center       |
| size      | spacing size; array means `[horizontal, vertical]`   | string / number / number[] | small / default / large / number  | small        |
| spacer    | spacer content between adjacent items                | string / number            | —                                 | —            |
| wrap      | auto wrapping when space runs out                    | boolean                    | —                                 | false        |
| fill      | whether items stretch to fill the container          | boolean                    | —                                 | false        |
| fillRatio | minimum width ratio (%) of each item when `fill`     | number                     | —                                 | 100          |
| prefixCls | class prefix of items (default `rumo-space`)         | string                     | —                                 | —            |

### Slots

| Name    | Description            |
| ------- | ---------------------- |
| default | items to be spaced     |
| spacer  | custom spacer content  |
