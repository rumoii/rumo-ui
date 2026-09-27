## AvatarGroup

Group size and shape apply to avatars without explicit values.

:::demo

```html
<rumo-avatar-group size="small" shape="square" collapse-avatars collapse-avatars-tooltip :max-collapse-avatars="2">
  <rumo-avatar>A</rumo-avatar><rumo-avatar>B</rumo-avatar>
  <rumo-avatar size="large" shape="circle">C</rumo-avatar><rumo-avatar>D</rumo-avatar>
</rumo-avatar-group>
```

:::

### Attributes

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| size | Default child size | string / number | — |
| shape | Default child shape | circle / square | circle |
| collapseAvatars | Collapse extra avatars | boolean | false |
| collapseAvatarsTooltip | Show hidden avatars on hover | boolean | false |
| maxCollapseAvatars | Visible avatars before collapse | number | 1 |
| effect / placement / popperClass | Tooltip theme, placement and class | string | light / top / — |
| collapseClass / collapseStyle | Collapse avatar class and style | string / object | — |

### Slots

| Name | Description |
| --- | --- |
| default | Avatar children |
