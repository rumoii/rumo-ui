## AvatarGroup 头像组

组内尺寸和形态会传给没有显式设置这些属性的头像。

:::demo

```html
<rumo-avatar-group size="small" shape="square" collapse-avatars collapse-avatars-tooltip :max-collapse-avatars="2">
  <rumo-avatar>A</rumo-avatar><rumo-avatar>B</rumo-avatar>
  <rumo-avatar size="large" shape="circle">C</rumo-avatar><rumo-avatar>D</rumo-avatar>
</rumo-avatar-group>
```

:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 组内头像默认尺寸 | string / number | — |
| shape | 组内头像默认形态 | circle / square | circle |
| collapseAvatars | 折叠多余头像 | boolean | false |
| collapseAvatarsTooltip | 悬停显示被折叠头像 | boolean | false |
| maxCollapseAvatars | 折叠前保留数 | number | 1 |
| effect / placement / popperClass | 折叠提示的主题、位置、类名 | string | light / top / — |
| collapseClass / collapseStyle | 折叠头像类名和样式 | string / object | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | Avatar 子项 |
