[toc]

## Icon 图标

提供了一套常用的图标集合。

### 图标集合
:::demo
```html
<div style="margin-bottom: 5px;">
  &nbsp;&nbsp;翻转:
  <rumo-radio-group v-model="spin" size="mini">
    <rumo-radio-button :label="true" name="spin">开</rumo-radio-button>
    <rumo-radio-button :label="false" name="spin">关</rumo-radio-button>
  </rumo-radio-group>
<!-- </div>
<div style="margin-bottom: 5px;"> -->
  &nbsp;&nbsp;尺寸:
  <rumo-radio-group v-model="size" size="mini">
    <rumo-radio-button :label="48" name="size">48</rumo-radio-button>
    <rumo-radio-button :label="36" name="size">36</rumo-radio-button>
    <rumo-radio-button :label="24" name="size">24</rumo-radio-button>
    <rumo-radio-button :label="18" name="size">18</rumo-radio-button>
    <rumo-radio-button :label="14" name="size">14</rumo-radio-button>
  </rumo-radio-group>
</div>
<div style="margin-bottom: 5px;">
  &nbsp;&nbsp;旋转:
  <rumo-radio-group v-model="rotate" size="mini">
    <rumo-radio-button :label="270" name="rotate">270</rumo-radio-button>
    <rumo-radio-button :label="180" name="rotate">180</rumo-radio-button>
    <rumo-radio-button :label="90" name="rotate">90</rumo-radio-button>
    <rumo-radio-button :label="null" name="rotate">默认</rumo-radio-button>
  </rumo-radio-group>
<!-- </div>
<div style="margin-bottom: 5px;"> -->
  &nbsp;&nbsp;镜像:
  <rumo-radio-group v-model="flip" size="mini">
    <rumo-radio-button label="horizontal" name="flip">垂直</rumo-radio-button>
    <rumo-radio-button label="vertical" name="flip">水平</rumo-radio-button>
    <rumo-radio-button :label="null" name="flip">关</rumo-radio-button>
  </rumo-radio-group>
</div>
<script>
  export default {
    data() {
      return {
        size: 24,
        rotate: null,
        flip: null,
        spin: false
      };
    },
    methods: {
      handlChange(val) {
        console.log(typeof val)
        return false
      }
    }
  }
</script>
```
:::

::: demo 大小

```html
<ul class="icon-list">
  <li v-for="icon in icons" :key="icon.class">
    <span>
      <rumo-icon :name="icon.class" :size="size" :rotate="rotate" :spin="spin" :flip="flip"></rumo-icon>
      <p class="icon-class">{{icon.class}}</p>
      <p class="icon-name">{{icon.name}}</p>
    </span>
  </li>
</ul>
<script>
  var iconList = require('examples/icon.json');

  export default {
    data() {
      return {
        icons: iconList,
        size: 24,
        rotate: null,
        flip: null,
        spin: false
      };
    }
  }
</script>
```
:::
