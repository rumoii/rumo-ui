## SvgIcon

Built-in SVG icon component. Icon data comes from the open-source Tabler Icons set (MIT, 500 curated icons in 8 groups). It coexists with `rumo-icon` (icon font); prefer SVG for new assets.

### Basic usage

Specify the icon by `name` (the original Tabler name, e.g. `arrow-left`).

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

### Size and color

`size` accepts a number (px) or any CSS length; `color` defaults to `currentColor` (inherits text color).

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

### Accessibility

When `title` is provided the icon is exposed to screen readers; decorative icons (default) are marked `aria-hidden`.

:::demo

```html
<rumo-svg-icon name="info-circle" title="Information"></rumo-svg-icon>
```

:::

### Icon wall (500 curated icons)

All built-in icons in 8 groups. Icon data lives in grouped modules (`rumo-ui/src/icons/tabler/<group>.js`) and can be imported per group on demand.

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

### Relationship with rumo-icons (icon font)

| | `rumo-icon` (font) | `rumo-svg-icon` (SVG) |
|---|---|---|
| Source | legacy icon font | Tabler Icons subset (MIT, attributed) |
| Usage | `<rumo-icon name="check">` (class `icon-check`) | `<rumo-svg-icon name="circle-check">` |
| Growing the set | requires font rebuild | regenerate icon data |
| New assets | frozen | **preferred** |

Class names never collide; both can be used on the same page.

### SvgIcon Attributes

| Attribute | Description                              | Type            | Accepted Values | Default       |
| --------- | ---------------------------------------- | --------------- | --------------- | ------------- |
| name      | icon name (original Tabler name)         | string          | —               | —             |
| size      | size (number = px, or any CSS length)    | string / number | —               | 24            |
| color     | stroke color                             | string          | —               | currentColor  |
| title     | accessible title (exposed when set)      | string          | —               | —             |
