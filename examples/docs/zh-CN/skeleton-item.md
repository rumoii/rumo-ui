## SkeletonItem 骨架项

可在 Skeleton 的 `template` 插槽中组合不同形状。

:::demo

```html
<rumo-skeleton :loading="true" animated>
  <template slot="template"><rumo-skeleton-item variant="circle" />
    <rumo-skeleton-item variant="text" /></template>
</rumo-skeleton>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | circle / rect / h1 / h3 / text / caption / p / image / button | string | text |
