
[toc]

## 快速上手

本节介绍如何在 Vue 2.6 项目中使用 Rumo UI。开始之前，请先按上一节"安装"把 rumo-ui 装进项目。

### 完整引入

在 main.js 中写入以下内容：

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'
import 'rumo-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(RumoUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

样式文件需要单独引入。

### 按需引入

每个组件都有独立的构建产物 `lib/<组件名>.js` 和样式 `lib/theme-chalk/<组件名>.css`，可以直接按路径引入，不需要额外的 Babel 插件。组件样式依赖公共的 `base.css`。

按需引入时**必须先设置 `Vue.prototype.$RUMO`**：完整引入时它由 `Vue.use(RumoUI)` 设置，而 Dialog、Message 等组件会直接读取它，缺少时运行报错。

```javascript
import Vue from 'vue'
import Button from 'rumo-ui/lib/button'
import Select from 'rumo-ui/lib/select'
import 'rumo-ui/lib/theme-chalk/base.css'
import 'rumo-ui/lib/theme-chalk/button.css'
import 'rumo-ui/lib/theme-chalk/select.css'

Vue.prototype.$RUMO = {
  size: '',
  zIndex: 2000,
  namespaceClass: '',
  getPopupContainer: undefined,
  messageOffsetTop: 20,
  drawer: { flexLayout: false }
}

Vue.use(Button)
Vue.use(Select)
```

文件名是组件名的短横线形式，例如 `DatePicker` 对应 `lib/date-picker.js`。全部组件见仓库根目录的 `components.json`。

如果项目使用 Babel，也可以借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component) 把 `import { Button } from 'rumo-ui'` 自动转换成上面的按路径引入：

```json
{
  "plugins": [["component", {
    "libraryName": "rumo-ui",
    "styleLibraryName": "theme-chalk"
  }]]
}
```

#### 完整列表

下面列出 `rumo-ui` 导出的全部组件、指令和服务，内容与 `src/index.js` 一致：

```javascript
import Vue from 'vue'
import {
  Pagination, Dialog, Autocomplete, Dropdown, DropdownMenu,
  DropdownItem, Menu, Submenu, MenuItem, MenuItemGroup, Input,
  InputNumber, Radio, RadioGroup, RadioButton, Checkbox,
  CheckboxButton, CheckboxGroup, RectCheckbox, Switch, Select, Option,
  OptionGroup, Button, ButtonGroup, Table, TableColumn, DatePicker,
  TimeSelect, TimePicker, Popover, Tooltip, Breadcrumb, BreadcrumbItem,
  Form, FormItem, Tabs, TabPane, Tag, Tree, Alert, Slider, Icon, Row,
  Col, Upload, Progress, Spinner, Badge, Card, Rate, Steps, Step,
  Carousel, Scrollbar, CarouselItem, Collapse, CollapseItem, Cascader,
  ColorPicker, Transfer, Container, Header, Aside, Main, Footer, Affix,
  Popconfirm, Timeline, TimelineItem, Link, Divider, Image, Calendar,
  Backtop, PageHeader, CascaderPanel, Avatar, Drawer, Empty, Space,
  Watermark, Text, Result, Segmented, CheckTag, Skeleton, SkeletonItem,
  Descriptions, DescriptionsItem, Statistic, Countdown, AvatarGroup,
  Splitpanes, SplitPane, Signature, Qr, Countup, SvgIcon, LogViewer,
  Terminal, CommandPalette, StackBar, TrendChart, TrendZoom, Heatmap,
  QuotaBar, StatTile, StatGrid, RankList, BreakdownList, RatioCard,
  InsightCard, SortableCard, DateRangePreset, CollapseTransition,
  InfiniteScroll, Animate, ScrollReveal, Loading, MessageBox, Message,
  Notification
} from 'rumo-ui'
import 'rumo-ui/lib/theme-chalk/index.css'

// 组件
[
  Pagination, Dialog, Autocomplete, Dropdown, DropdownMenu,
  DropdownItem, Menu, Submenu, MenuItem, MenuItemGroup, Input,
  InputNumber, Radio, RadioGroup, RadioButton, Checkbox,
  CheckboxButton, CheckboxGroup, RectCheckbox, Switch, Select, Option,
  OptionGroup, Button, ButtonGroup, Table, TableColumn, DatePicker,
  TimeSelect, TimePicker, Popover, Tooltip, Breadcrumb, BreadcrumbItem,
  Form, FormItem, Tabs, TabPane, Tag, Tree, Alert, Slider, Icon, Row,
  Col, Upload, Progress, Spinner, Badge, Card, Rate, Steps, Step,
  Carousel, Scrollbar, CarouselItem, Collapse, CollapseItem, Cascader,
  ColorPicker, Transfer, Container, Header, Aside, Main, Footer, Affix,
  Popconfirm, Timeline, TimelineItem, Link, Divider, Image, Calendar,
  Backtop, PageHeader, CascaderPanel, Avatar, Drawer, Empty, Space,
  Watermark, Text, Result, Segmented, CheckTag, Skeleton, SkeletonItem,
  Descriptions, DescriptionsItem, Statistic, Countdown, AvatarGroup,
  Splitpanes, SplitPane, Signature, Qr, Countup, SvgIcon, LogViewer,
  Terminal, CommandPalette, StackBar, TrendChart, TrendZoom, Heatmap,
  QuotaBar, StatTile, StatGrid, RankList, BreakdownList, RatioCard,
  InsightCard, SortableCard, DateRangePreset, CollapseTransition
].forEach(component => Vue.use(component))

// 指令
Vue.use(InfiniteScroll)
Vue.use(Animate)
Vue.use(ScrollReveal)
Vue.use(Loading.directive)

// 服务
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
```

### 全局配置

`Vue.use(RumoUI, options)` 时可以传入全局配置：

| 字段 | 说明 | 默认值 |
| --- | --- | --- |
| size | 拥有 `size` 属性的组件的默认尺寸，可选值以各组件文档的 `size` 属性为准 | — |
| zIndex | 弹出层的初始 z-index | 2000 |
| namespaceClass | 追加到弹出层（Dialog、Drawer、Popover、Select 下拉等）根节点上的 class | — |
| getPopupContainer | 返回弹出层挂载节点的函数 | 挂载到 `document.body` |
| messageOffsetTop | Message 距窗口顶部的偏移，单位 px | 20 |
| drawer.flexLayout | Drawer 的默认 `flex-layout` 值 | false |
| locale / i18n | 语言包与自定义 i18n 处理函数，见"国际化" | — |

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'

Vue.use(RumoUI, { size: 'small', zIndex: 3000 })
```

按需引入时，在注册组件之前把同样的字段写进 `Vue.prototype.$RUMO`，并且要写全，未改动的字段保留上面的默认值：

```javascript
import Vue from 'vue'
import Button from 'rumo-ui/lib/button'

Vue.prototype.$RUMO = {
  size: 'small',
  zIndex: 3000,
  namespaceClass: '',
  getPopupContainer: undefined,
  messageOffsetTop: 20,
  drawer: { flexLayout: false }
}
Vue.use(Button)
```

### 开始使用

各个组件的用法请参阅它们各自的文档。
