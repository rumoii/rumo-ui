## SplitPane

Use SplitPane inside Splitpanes. size, min and max are percentages of the container.

:::demo

```html
<rumo-splitpanes style="height: 160px" horizontal>
  <rumo-split-pane :size="40" :min="20" :max="70">Top</rumo-split-pane>
  <rumo-split-pane :min="20">Bottom</rumo-split-pane>
</rumo-splitpanes>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| size | Initial or externally updated size (%) | number / string | — |
| min | Minimum size (%) | number / string | 0 |
| max | Maximum size (%) | number / string | 100 |
