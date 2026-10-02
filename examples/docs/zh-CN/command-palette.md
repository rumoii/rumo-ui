## CommandPalette 命令面板

快捷键唤出的全局指令浮层,支持模糊过滤与键盘导航。用于控制台、管理后台的全键盘指令检索与快速跳转,与 LogViewer、Terminal 构成控制台工具三件套。

:::tip 快捷键策略
1. 默认组合键 `Ctrl+K` / `⌘K`,命中即拦截浏览器默认行为(阻止地址栏聚焦)。
2. `hotkey` 支持自定义组合键(逗号分隔多组)或传 `false` 关闭全局监听、仅外部受控。
3. `scope` 可限定响应范围为指定容器。
4. 输入控件避让:焦点在输入框时,无修饰键的组合不拦截、不影响正常打字。
:::

### 基础用法

按下 `Ctrl+K` 唤起面板,键入过滤,`↑` `↓` 移动,`Enter` 选中,`Esc` 关闭。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="visible = true">打开面板</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">
        或直接按 Ctrl+K;已选指令:{{ selected || '无' }}
      </span>
    </div>
    <rumo-command-palette
      v-model="visible"
      :commands="commands"
      @select="onSelect"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      selected: '',
      commands: [
        { id: 'new-file', title: '新建文件', category: '文件', shortcut: 'Ctrl+N' },
        { id: 'open-file', title: '打开文件', category: '文件', shortcut: 'Ctrl+O' },
        { id: 'save', title: '保存', category: '文件', shortcut: 'Ctrl+S' },
        { id: 'toggle-theme', title: '切换深色主题', category: '视图' },
        { id: 'run-build', title: '运行构建', category: '任务' },
        { id: 'open-terminal', title: '打开终端', category: '工具', shortcut: 'Ctrl+`' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.selected = cmd.title;
    }
  }
};
</script>
```
:::

### 自定义快捷键与受控模式

`hotkey` 可替换组合键;传 `false` 关闭全局监听,由外部完全受控(适合与宿主快捷键体系集成)。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" @click="customVisible = true">打开(自定义 Ctrl+Shift+P)</rumo-button>
      <rumo-button size="small" @click="controlledVisible = true">打开(无全局热键)</rumo-button>
    </div>
    <rumo-command-palette
      :visible.sync="customVisible"
      hotkey="ctrl+shift+p"
      :commands="commands"
      @select="onSelect"
    />
    <rumo-command-palette
      v-model:visible="controlledVisible"
      :hotkey="false"
      :commands="commands"
      @select="onSelect"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      customVisible: false,
      controlledVisible: false,
      commands: [
        { id: 'a', title: '指令 A', category: '演示' },
        { id: 'b', title: '指令 B', category: '演示' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.$message && this.$message('选中: ' + cmd.title);
    }
  }
};
</script>
```
:::

### 分类、快捷键与图标

`commands` 项支持 `category` 分类、`shortcut` 快捷键提示与 `icon` 图标文本;过滤按 标题 > 分类 > 快捷键 的优先级匹配排序。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="visible = true">打开面板</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">试试输入「视图」或「Ctrl」</span>
    </div>
    <rumo-command-palette
      v-model="visible"
      :hotkey="false"
      :commands="commands"
      @select="onSelect"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      commands: [
        { id: 'copy', title: '复制', category: '编辑', shortcut: 'Ctrl+C', icon: '⧉' },
        { id: 'paste', title: '粘贴', category: '编辑', shortcut: 'Ctrl+V', icon: '📋' },
        { id: 'zoom-in', title: '放大', category: '视图', shortcut: 'Ctrl+ +', icon: '🔍' },
        { id: 'zoom-out', title: '缩小', category: '视图', shortcut: 'Ctrl+ -', icon: '🔎' },
        { id: 'fullscreen', title: '全屏', category: '视图', shortcut: 'F11', icon: '⛶' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.$message && this.$message('选中: ' + cmd.title);
    }
  }
};
</script>
```
:::

### 作用域限制

`scope` 传入容器选择器后,仅当焦点位于该容器内时快捷键才生效,避免污染宿主页的快捷键体系。

:::demo
```html
<template>
  <div>
    <div id="palette-zone" tabindex="0" style="padding: 16px; border: 1px dashed #dcdfe6; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #666;">点击此虚线框内部获得焦点后按 Ctrl+Alt+K 才会唤起;框外无效。</p>
      <rumo-button size="small" type="primary" @click="visible = true">或点击打开</rumo-button>
    </div>
    <rumo-command-palette
      v-model="visible"
      hotkey="ctrl+alt+k"
      scope="#palette-zone"
      :commands="commands"
      @select="onSelect"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      commands: [
        { id: 'in-zone', title: '作用域内指令', category: 'Scope' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.$message && this.$message('选中: ' + cmd.title);
    }
  }
};
</script>
```
:::

### Dash 变体

`variant="dash"` 提供看板设计语言的视觉:面板圆角描边与柔阴影、条目圆角与中性选中态、快捷键徽标与分类标签收敛为中性芯片。不设 `variant` 时外观不变。
:::demo
```html
<template>
  <rumo-button size="small" type="primary" @click="visible = true">打开 Dash 变体面板</rumo-button>
  <rumo-command-palette
    v-model="visible"
    variant="dash"
    :hotkey="false"
    :commands="commands"
  />
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      commands: [
        { id: 'overview', title: '用量总览', category: 'Dashboard', shortcut: 'G O' },
        { id: 'trend', title: '趋势监控', category: 'Dashboard', shortcut: 'G T' },
        { id: 'settings', title: '打开设置', category: 'General', shortcut: 'Ctrl+,' }
      ]
    };
  }
};
</script>
```
:::

### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| visible | 面板可见性,支持 v-model / .sync | boolean | — | false |
| commands | 指令列表,项含 `id` / `title` / `category?` / `shortcut?` / `icon?` | array | — | [] |
| placeholder | 搜索框占位文案(默认走 i18n) | string | — | 键入指令或搜索... |
| hotkey | 全局组合键,逗号分隔多组;false 关闭全局监听 | string / boolean | — | 'ctrl+k, command+k' |
| scope | 响应范围 | string / HTMLElement | 'global' / 容器选择器 / DOM | 'global' |
| variant | Dash 皮肤视觉变体,设置为 `dash` 时启用看板视觉 | string | dash | — |

### Events

| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| select | 选中指令时触发(触发后面板自动隐藏) | `(command: object)` |
| update:visible | 面板显示状态变化(v-model / .sync 内部事件) | `(visible: boolean)` |
