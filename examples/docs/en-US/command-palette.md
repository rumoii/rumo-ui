## CommandPalette

A hotkey-invoked global command overlay with fuzzy filtering and keyboard navigation. Designed for console / admin dashboards with full-keyboard command lookup — completing the console toolkit trio alongside LogViewer and Terminal.

:::tip Hotkey policy
1. Default combo is `Ctrl+K` / `⌘K`; a hit immediately calls preventDefault (blocking the browser address-bar focus).
2. `hotkey` accepts custom combos (comma-separated) or `false` to disable global listening and stay externally controlled.
3. `scope` can limit the response to a specific container.
4. Input deferral: when focus is in a text control, modifier-less combos are never intercepted — normal typing is never disturbed.
:::

### Basic Usage

Press `Ctrl+K` to open the palette, type to filter, `↑` `↓` to move, `Enter` to select, `Esc` to close.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="visible = true">Open palette</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">
        Or just press Ctrl+K; selected: {{ selected || 'none' }}
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
        { id: 'new-file', title: 'New File', category: 'File', shortcut: 'Ctrl+N' },
        { id: 'open-file', title: 'Open File', category: 'File', shortcut: 'Ctrl+O' },
        { id: 'save', title: 'Save', category: 'File', shortcut: 'Ctrl+S' },
        { id: 'toggle-theme', title: 'Toggle Dark Theme', category: 'View' },
        { id: 'run-build', title: 'Run Build', category: 'Task' },
        { id: 'open-terminal', title: 'Open Terminal', category: 'Tools', shortcut: 'Ctrl+`' }
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

### Custom Hotkey & Controlled Mode

`hotkey` can replace the combo; pass `false` to disable global listening and drive the palette entirely from outside (for integrating with a host hotkey system).

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" @click="customVisible = true">Open (custom Ctrl+Shift+P)</rumo-button>
      <rumo-button size="small" @click="controlledVisible = true">Open (no global hotkey)</rumo-button>
    </div>
    <rumo-command-palette
      :visible.sync="customVisible"
      hotkey="ctrl+shift+p"
      :commands="commands"
      @select="onSelect"
    />
    <rumo-command-palette
      :visible.sync="controlledVisible"
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
        { id: 'a', title: 'Command A', category: 'Demo' },
        { id: 'b', title: 'Command B', category: 'Demo' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.$message && this.$message('Selected: ' + cmd.title);
    }
  }
};
</script>
```
:::

### Categories, Shortcuts & Icons

Command items support `category`, a `shortcut` hint and an `icon` text; filtering matches with priority title > category > shortcut.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="visible = true">Open palette</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">Try typing "View" or "Ctrl"</span>
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
        { id: 'copy', title: 'Copy', category: 'Edit', shortcut: 'Ctrl+C', icon: '⧉' },
        { id: 'paste', title: 'Paste', category: 'Edit', shortcut: 'Ctrl+V', icon: '📋' },
        { id: 'zoom-in', title: 'Zoom In', category: 'View', shortcut: 'Ctrl+ +', icon: '🔍' },
        { id: 'zoom-out', title: 'Zoom Out', category: 'View', shortcut: 'Ctrl+ -', icon: '🔎' },
        { id: 'fullscreen', title: 'Fullscreen', category: 'View', shortcut: 'F11', icon: '⛶' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.$message && this.$message('Selected: ' + cmd.title);
    }
  }
};
</script>
```
:::

### Scope Limitation

With `scope` set to a container selector, the hotkey only fires when focus is inside that container — never polluting the host page's hotkey system.

:::demo
```html
<template>
  <div>
    <div id="palette-zone" tabindex="0" style="padding: 16px; border: 1px dashed #dcdfe6; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Click inside this dashed box first — Ctrl+Alt+K only works from there.</p>
      <rumo-button size="small" type="primary" @click="visible = true">Or click to open</rumo-button>
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
        { id: 'in-zone', title: 'In-zone command', category: 'Scope' }
      ]
    };
  },
  methods: {
    onSelect(cmd) {
      this.$message && this.$message('Selected: ' + cmd.title);
    }
  }
};
</script>
```
:::

### Attributes

| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| visible | Palette visibility, supports v-model / .sync | boolean | — | false |
| commands | Command list; items carry `id` / `title` / `category?` / `shortcut?` / `icon?` | array | — | [] |
| placeholder | Search input placeholder (defaults to i18n) | string | — | Type a command or search... |
| hotkey | Global combos, comma-separated; `false` disables global listening | string / boolean | — | 'ctrl+k, command+k' |
| scope | Response scope | string / HTMLElement | 'global' / container selector / DOM | 'global' |

### Events

| Event | Description | Arguments |
|---|---|---|
| select | Fired when a command is selected (palette auto-hides afterwards) | `(command: object)` |
| update:visible | Visibility change (internal event for v-model / .sync) | `(visible: boolean)` |
