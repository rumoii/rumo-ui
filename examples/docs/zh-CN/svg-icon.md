## SvgIcon 矢量图标

内置的 SVG 图标组件,图标数据来自开源图标库 Tabler Icons(MIT,精选 500 个常用图标,8 组)。与 `rumo-icon`(字体图标)并存互不冲突,新资产优先用 SVG 图标。

### 基础用法

通过 `name` 指定图标名(Tabler 原名,如 `arrow-left`)。

:::demo

```html
<div>
  <rumo-svg-icon name="home"></rumo-svg-icon>
  <rumo-svg-icon name="search"></rumo-svg-icon>
  <rumo-svg-icon name="settings"></rumo-svg-icon>
  <rumo-svg-icon name="user"></rumo-svg-icon>
</div>
```

:::

### 尺寸与颜色

`size` 支持数字(px)或任意 CSS 长度;`color` 默认 `currentColor` 跟随文字色。

:::demo

```html
<div>
  <rumo-svg-icon name="star" :size="16"></rumo-svg-icon>
  <rumo-svg-icon name="star" :size="24"></rumo-svg-icon>
  <rumo-svg-icon name="star" :size="32"></rumo-svg-icon>
  <rumo-svg-icon name="heart" :size="24" color="#F45757"></rumo-svg-icon>
  <rumo-svg-icon name="heart" :size="24" color="#2ABC80"></rumo-svg-icon>
</div>
```

:::

### 无障碍

传 `title` 时图标会暴露给读屏软件;纯装饰图标(默认)已标记 `aria-hidden`。

:::demo

```html
<rumo-svg-icon name="info-circle" title="提示信息"></rumo-svg-icon>
```

:::

### 图标墙(精选 500 个)

按 8 组展示全部内置图标;图标数据分组存放(`rumo-ui/src/icons/tabler/<group>.js`),可按组按需引入。

:::demo

```html
<div class="svg-icon-wall">
  <div v-for="(group, gname) in groups" :key="gname" style="margin-bottom: 16px;">
    <h4 style="margin: 8px 0;">{{ gname }}({{ Object.keys(group).length }})</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <div
        v-for="(paths, name) in group"
        :key="name"
        style="width: 96px; text-align: center; font-size: 12px;"
      >
        <rumo-svg-icon :name="name" :size="22" :title="name"></rumo-svg-icon>
        <div style="word-break: break-all; color: #999;">{{ name }}</div>
      </div>
    </div>
  </div>
</div>

<script>
  export default {
    data() {
      const tabler = require('rumo-ui/src/icons/tabler');
      return {
        groups: {
          arrows: tabler.arrows,
          actions: tabler.actions,
          status: tabler.status,
          files: tabler.files,
          media: tabler.media,
          editing: tabler.editing,
          navigation: tabler.navigation,
          communication: tabler.communication
        }
      };
    }
  };
</script>
```

:::

### 与 rumo-icons 字体图标的关系

| | `rumo-icon`(字体) | `rumo-svg-icon`(SVG) |
|---|---|---|
| 来源 | 历史存量图标字体 | Tabler Icons 精选(MIT,来源已标注) |
| 用法 | `<rumo-icon name="check">`(类名 `icon-check`) | `<rumo-svg-icon name="circle-check">` |
| 增量扩充 | 需重编字体 | 重新生成图标数据即可 |
| 新资产 | 不再新增 | **优先用这个** |

两者类名/命名互不冲突,可同页共存。

### SvgIcon Attributes

| 参数   | 说明                             | 类型            | 可选值 | 默认值        |
| ------ | -------------------------------- | --------------- | ------ | ------------- |
| name   | 图标名(Tabler 原名)             | string          | —      | —             |
| size   | 尺寸(数字为 px 或 CSS 长度)  | string / number | —      | 24            |
| color  | 描边颜色                         | string          | —      | currentColor  |
| title  | 无障碍标题(设置后读屏可见) | string          | —      | —             |
