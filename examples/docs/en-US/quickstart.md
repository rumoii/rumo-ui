
[toc]

## Quick Start

This section shows how to use Rumo UI in a Vue 2.6 project. First install rumo-ui into your project as described in the previous section, Installation.

### Full import

In main.js:

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

The stylesheet must be imported separately.

### On-demand import

Every component has its own build output `lib/<component>.js` and stylesheet `lib/theme-chalk/<component>.css`, so you can import it by path without any Babel plugin. Component styles depend on the shared `base.css`.

With on-demand import you **must set `Vue.prototype.$RUMO` first**: a full import sets it in `Vue.use(RumoUI)`, and components such as Dialog and Message read it directly and throw without it.

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

File names are the kebab-case component names, for example `DatePicker` is `lib/date-picker.js`. See `components.json` in the repository root for every component.

With Babel, [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component) can rewrite `import { Button } from 'rumo-ui'` into the path imports above:

```json
{
  "plugins": [["component", {
    "libraryName": "rumo-ui",
    "styleLibraryName": "theme-chalk"
  }]]
}
```

#### Full list

Every component, directive, and service exported by `rumo-ui`, matching `src/index.js`:

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

// components
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

// directives
Vue.use(InfiniteScroll)
Vue.use(Animate)
Vue.use(ScrollReveal)
Vue.use(Loading.directive)

// services
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
```

### Global config

`Vue.use(RumoUI, options)` accepts a global config:

| Field | Description | Default |
| --- | --- | --- |
| size | Default size of components that have a `size` prop; see each component's `size` prop for allowed values | — |
| zIndex | Initial z-index of popups | 2000 |
| namespaceClass | Class added to the root of popups (Dialog, Drawer, Popover, Select dropdown, and so on) | — |
| getPopupContainer | Function that returns the node popups mount into | mounts into `document.body` |
| messageOffsetTop | Distance of Message from the top of the window, in px | 20 |
| drawer.flexLayout | Default `flex-layout` of Drawer | false |
| locale / i18n | Language pack and custom i18n handler, see Internationalization | — |

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'

Vue.use(RumoUI, { size: 'small', zIndex: 3000 })
```

With on-demand import, put the same fields into `Vue.prototype.$RUMO` before registering components. Set every field, keeping the defaults above for the ones you do not change:

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

### Start coding

See each component's page for how to use it.
