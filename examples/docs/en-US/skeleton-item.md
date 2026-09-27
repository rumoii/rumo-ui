## SkeletonItem

Combine shapes in Skeleton's `template` slot.

:::demo

```html
<rumo-skeleton :loading="true" animated>
  <template slot="template"><rumo-skeleton-item variant="circle" />
    <rumo-skeleton-item variant="text" /></template>
</rumo-skeleton>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| variant | circle / rect / h1 / h3 / text / caption / p / image / button | string | text |
