## Container 布局容器
用于布局的容器组件，方便快速搭建页面的基本结构：

`<rumo-container>`：外层容器。当子元素中包含 `<rumo-header>` 或 `<rumo-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<rumo-header>`：顶栏容器。

`<rumo-aside>`：侧边栏容器。

`<rumo-main>`：主要区域容器。

`<rumo-footer>`：底栏容器。

:::tip
以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外，`<rumo-container>` 的子元素只能是后四者，后四者的父元素也只能是 `<rumo-container>`。
:::

### 常见页面布局

:::demo
```html
<div class="demo-test">
  <rumo-container>
    <rumo-header>Header</rumo-header>
    <rumo-main>Main</rumo-main>
  </rumo-container>

  <rumo-container>
    <rumo-header>Header</rumo-header>
    <rumo-main>Main</rumo-main>
    <rumo-footer>Footer</rumo-footer>
  </rumo-container>

  <rumo-container>
    <rumo-aside width="200px">Aside</rumo-aside>
    <rumo-main>Main</rumo-main>
  </rumo-container>

  <rumo-container>
    <rumo-header>Header</rumo-header>
    <rumo-container>
      <rumo-aside width="200px">Aside</rumo-aside>
      <rumo-main>Main</rumo-main>
    </rumo-container>
  </rumo-container>

  <rumo-container>
    <rumo-header>Header</rumo-header>
    <rumo-container>
      <rumo-aside width="200px">Aside</rumo-aside>
      <rumo-container>
        <rumo-main>Main</rumo-main>
        <rumo-footer>Footer</rumo-footer>
      </rumo-container>
    </rumo-container>
  </rumo-container>

  <rumo-container>
    <rumo-aside width="200px">Aside</rumo-aside>
    <rumo-container>
      <rumo-header>Header</rumo-header>
      <rumo-main>Main</rumo-main>
    </rumo-container>
  </rumo-container>

  <rumo-container>
    <rumo-aside width="200px">Aside</rumo-aside>
    <rumo-container>
      <rumo-header>Header</rumo-header>
      <rumo-main>Main</rumo-main>
      <rumo-footer>Footer</rumo-footer>
    </rumo-container>
  </rumo-container>
</div>
<style>
  .rumo-header, .rumo-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .rumo-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .rumo-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .rumo-container {
    margin-bottom: 40px;
  }
  
  .rumo-container:nth-child(5) .rumo-aside,
  .rumo-container:nth-child(6) .rumo-aside {
    line-height: 260px;
  }
  
  .rumo-container:nth-child(7) .rumo-aside {
    line-height: 320px;
  }
</style>
```
:::

### 实例

:::demo
```html
<rumo-container style="height: 500px; border: 1px solid #eee">
  <rumo-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <rumo-menu :default-openeds="['1', '3']">
      <rumo-submenu index="1">
        <template slot="title"><i class="rumo-icons icon-email"></i>导航一</template>
        <rumo-menu-item-group>
          <template slot="title">分组一</template>
          <rumo-menu-item index="1-1">选项1</rumo-menu-item>
          <rumo-menu-item index="1-2">选项2</rumo-menu-item>
        </rumo-menu-item-group>
        <rumo-menu-item-group title="分组2">
          <rumo-menu-item index="1-3">选项3</rumo-menu-item>
        </rumo-menu-item-group>
        <rumo-submenu index="1-4">
          <template slot="title">选项4</template>
          <rumo-menu-item index="1-4-1">选项4-1</rumo-menu-item>
        </rumo-submenu>
      </rumo-submenu>
      <rumo-submenu index="2">
        <template slot="title"><i class="rumo-icons icon-th-large"></i>导航二</template>
        <rumo-menu-item-group>
          <template slot="title">分组一</template>
          <rumo-menu-item index="2-1">选项1</rumo-menu-item>
          <rumo-menu-item index="2-2">选项2</rumo-menu-item>
        </rumo-menu-item-group>
        <rumo-menu-item-group title="分组2">
          <rumo-menu-item index="2-3">选项3</rumo-menu-item>
        </rumo-menu-item-group>
        <rumo-submenu index="2-4">
          <template slot="title">选项4</template>
          <rumo-menu-item index="2-4-1">选项4-1</rumo-menu-item>
        </rumo-submenu>
      </rumo-submenu>
      <rumo-submenu index="3">
        <template slot="title"><i class="rumo-icons icon-cog"></i>导航三</template>
        <rumo-menu-item-group>
          <template slot="title">分组一</template>
          <rumo-menu-item index="3-1">选项1</rumo-menu-item>
          <rumo-menu-item index="3-2">选项2</rumo-menu-item>
        </rumo-menu-item-group>
        <rumo-menu-item-group title="分组2">
          <rumo-menu-item index="3-3">选项3</rumo-menu-item>
        </rumo-menu-item-group>
        <rumo-submenu index="3-4">
          <template slot="title">选项4</template>
          <rumo-menu-item index="3-4-1">选项4-1</rumo-menu-item>
        </rumo-submenu>
      </rumo-submenu>
    </rumo-menu>
  </rumo-aside>
  
  <rumo-container>
    <rumo-header style="text-align: right; font-size: 12px">
      <rumo-dropdown>
        <i class="rumo-icons icon-cog" style="margin-right: 15px"></i>
        <rumo-dropdown-menu slot="dropdown">
          <rumo-dropdown-item>查看</rumo-dropdown-item>
          <rumo-dropdown-item>新增</rumo-dropdown-item>
          <rumo-dropdown-item>删除</rumo-dropdown-item>
        </rumo-dropdown-menu>
      </rumo-dropdown>
      <span>王小虎</span>
    </rumo-header>
    
    <rumo-main>
      <rumo-table :data="tableData">
        <rumo-table-column prop="date" label="日期" width="140">
        </rumo-table-column>
        <rumo-table-column prop="name" label="姓名" width="120">
        </rumo-table-column>
        <rumo-table-column prop="address" label="地址">
        </rumo-table-column>
      </rumo-table>
    </rumo-main>
  </rumo-container>
</rumo-container>
<style>
  .rumo-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .rumo-aside {
    color: #333;
  }
</style>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item)
      }
    }
  };
</script>
```
:::

### Container Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| direction | 子元素的排列方向 | string | horizontal / vertical | 子元素中有 `rumo-header` 或 `rumo-footer` 时为 vertical，否则为 horizontal |

### Header Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| height | 顶栏高度 | string | — | 60px |

### Aside Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| width | 侧边栏宽度 | string | — | 300px |

### Footer Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| height | 底栏高度 | string | — | 60px |
