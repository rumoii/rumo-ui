## Result

A page-level feedback component for operation results. Supports five status icons plus custom title / subtitle / action areas.

### Basic usage

:::demo

```html
<rumo-result icon="success" title="Submitted" sub-title="Your application is now under review">
</rumo-result>
```

:::

### Different statuses

`icon` accepts `primary` / `success` / `warning` / `error` / `info`.

:::demo

```html
<div>
  <rumo-result icon="error" title="Failed" sub-title="Network error, please retry later"></rumo-result>
  <rumo-result icon="warning" title="Warning" sub-title="This operation carries risk"></rumo-result>
</div>
```

:::

### Custom content

Customize icon, title, subtitle and the bottom action area via slots.

:::demo

```html
<rumo-result icon="info" title="Custom result">
  <template slot="sub-title">
    <rumo-text type="info" size="small">Subtitle supports rich slot content</rumo-text>
  </template>
  <template slot="extra">
    <rumo-button type="primary">Back home</rumo-button>
    <rumo-button>Details</rumo-button>
  </template>
</rumo-result>
```

:::

### Result Attributes

| Attribute | Description     | Type   | Accepted Values                            | Default |
| --------- | --------------- | ------ | ------------------------------------------ | ------- |
| title     | title           | string | —                                          | —       |
| sub-title | sub title       | string | —                                          | —       |
| icon      | status icon type| string | primary / success / warning / error / info | info    |

### Slots

| Name      | Description          |
| --------- | -------------------- |
| icon      | custom icon          |
| title     | custom title         |
| sub-title | custom sub title     |
| extra     | bottom action area   |
