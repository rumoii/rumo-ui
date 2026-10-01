## Terminal 终端模拟器

基于 `xterm@5.3.0` 与 `xterm-addon-fit@0.8.0` 的 Web 交互终端组件。用于云原生控制台、Web SSH、本地 AI Agent / CLI 工具的交互式终端仿真与实时命令行交互。

:::tip 架构说明与版本锁定承诺
1. **依赖锁定**：精准锁定 `xterm@5.3.0` 与 `xterm-addon-fit@0.8.0`（在 `package.json` 中无 `^` 或 `~` 通配符）。
2. **锁定原因**：xterm 自 5.4.0 起及官方迁移目标 `@xterm/*` 作用域包全面引入了 ES2020 可选链语法（`?.`）。当前 `rumo-ui` 编译工具链为 Webpack 4.47.0 与 Babel 6，内置 Acorn 6 解析器无法解析 ES2020 语法，会导致打包报错 `Module parse failed: Unexpected token`。同时，为保障构建链纯净，项目拒绝引入 `esbuild-loader` 等额外编译链。
3. **迁移时机**：未来全库系统性升级至 Vue 3 + Webpack 5 + Babel 7 时，再统一无缝迁移至 `@xterm/xterm` 与 `@xterm/addon-fit` 最新版本。
:::

### 基础用法与输出

初始化终端展示，支持闪烁光标、ANSI 彩色字符流与常用终端快捷方法。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="handlePrintBanner">输出欢迎信息</rumo-button>
      <rumo-button size="small" @click="handleClear">清屏</rumo-button>
    </div>
    <div style="height: 240px;">
      <rumo-terminal
        ref="term"
        @init="onInit"
      />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onInit(term) {
      this.handlePrintBanner();
    },
    handlePrintBanner() {
      const term = this.$refs.term;
      if (!term) return;
      term.writeln('\x1b[35;1m   ___  __  ____  _______     __  ______\x1b[0m');
      term.writeln('\x1b[35;1m  / _ \\/ / / /  |/  / __ \\   / / / /  _/\x1b[0m');
      term.writeln('\x1b[35;1m / , _/ /_/ / /|_/ / /_/ /  / /_/ // /  \x1b[0m');
      term.writeln('\x1b[35;1m/_/|_|\\____/_/  /_/\\____/   \\____/___/  \x1b[0m');
      term.writeln('');
      term.writeln('\x1b[32m[System]\x1b[0m RumoTerminal initialized successfully.');
      term.writeln('\x1b[36m[Kernel]\x1b[0m Linux 6.6.137-rumo-tui x86_64 GNU/Linux');
      term.writeln('\x1b[33m[Status]\x1b[0m Pinned engine: \x1b[1mxterm@5.3.0\x1b[0m (FitAddon @0.8.0)');
      term.write('\r\n$ ');
    },
    handleClear() {
      const term = this.$refs.term;
      if (term) {
        term.clear();
        term.write('$ ');
      }
    }
  }
};
</script>
```
:::

### 模拟交互命令行

监听 `@data` 事件接收输入字符流，可实现轻量本地交互式 Shell（回显、回车换行、退格删除）。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px; font-size: 13px; color: #666;">
      提示：在终端内键入命令（如输入 <code>help</code>、<code>date</code> 或 <code>clear</code> 后按回车）
    </div>
    <div style="height: 240px;">
      <rumo-terminal
        ref="shellTerm"
        @init="onShellInit"
        @data="onShellData"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentLine: ''
    };
  },
  methods: {
    onShellInit(term) {
      term.writeln('\x1b[32mInteractive Web Shell Ready.\x1b[0m Type \x1b[33mhelp\x1b[0m for commands.');
      term.write('\r\n$ ');
    },
    onShellData(data) {
      const term = this.$refs.shellTerm;
      if (!term) return;

      // 回车 (Enter)
      if (data === '\r') {
        term.writeln('');
        this.executeCommand(this.currentLine.trim());
        this.currentLine = '';
        term.write('$ ');
      }
      // 退格 (Backspace)
      else if (data === '\u007f' || data === '\b') {
        if (this.currentLine.length > 0) {
          this.currentLine = this.currentLine.slice(0, -1);
          term.write('\b \b');
        }
      }
      // 普通字符输入
      else if (data >= ' ' || data === '\t') {
        this.currentLine += data;
        term.write(data);
      }
    },
    executeCommand(cmd) {
      const term = this.$refs.shellTerm;
      if (!term) return;
      if (!cmd) return;

      if (cmd === 'help') {
        term.writeln('Available commands:');
        term.writeln('  \x1b[36mhelp\x1b[0m   - Show available commands');
        term.writeln('  \x1b[36mdate\x1b[0m   - Print current timestamp');
        term.writeln('  \x1b[36mclear\x1b[0m  - Clear terminal screen');
      } else if (cmd === 'date') {
        term.writeln(`Current Time: ${new Date().toISOString()}`);
      } else if (cmd === 'clear') {
        term.clear();
      } else {
        term.writeln(`\x1b[31mbash: ${cmd}: command not found\x1b[0m`);
      }
    }
  }
};
</script>
```
:::

### 容器尺寸自适应

默认开启 `autoFit`，当外层容器宽度、高度变化时，组件基于 `ResizeObserver` 自动调用 `fit()` 适配终端行列矩阵。也可通过 `fit()` 主动触发适配。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" @click="toggleContainerWidth">
        切换容器宽度: {{ containerWidth }}
      </rumo-button>
      <rumo-button size="small" @click="handleManualFit">主动调用 fit()</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">
        当前终端网格: {{ gridInfo }}
      </span>
    </div>
    <div :style="{ width: containerWidth, height: '220px', transition: 'width 0.3s' }">
      <rumo-terminal
        ref="fitTerm"
        :auto-fit="true"
        @init="onFitInit"
        @resize="onResize"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      containerWidth: '100%',
      gridInfo: '80 x 24'
    };
  },
  methods: {
    onFitInit(term) {
      term.writeln('Resize container or window to test auto-fit behavior.');
      term.writeln(`Initial cols: ${term.cols}, rows: ${term.rows}`);
      this.gridInfo = `${term.cols} x ${term.rows}`;
    },
    onResize(size) {
      this.gridInfo = `${size.cols} x ${size.rows}`;
    },
    toggleContainerWidth() {
      this.containerWidth = this.containerWidth === '100%' ? '60%' : '100%';
    },
    handleManualFit() {
      const term = this.$refs.fitTerm;
      if (term) {
        term.fit();
      }
    }
  }
};
</script>
```
:::

### 只读模式与主题定制

设置 `readOnly` 拦截所有键盘交互；通过 `options.theme` 自由定制终端背景色与语法高亮色彩。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-checkbox v-model="isReadOnly">只读模式 (readOnly)</rumo-checkbox>
    </div>
    <div style="height: 220px;">
      <rumo-terminal
        ref="customTerm"
        :read-only="isReadOnly"
        :options="customOptions"
        @init="onCustomInit"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isReadOnly: true,
      customOptions: {
        fontSize: 13,
        theme: {
          background: '#0d1117',
          foreground: '#58a6ff',
          cursor: '#58a6ff'
        }
      }
    };
  },
  methods: {
    onCustomInit(term) {
      term.writeln('\x1b[34m[ReadOnly Console]\x1b[0m Custom Dark Theme (#0d1117)');
      term.writeln('Try typing here when readOnly is enabled: input is disabled.');
      term.writeln('Toggle the checkbox above to allow typing.');
    }
  }
};
</script>
```
:::

### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| options | 透传 xterm `ITerminalOptions` 原生配置 | object | — | 默认深色配置 |
| rows | 终端默认行数（未开启 fit 或容器不可见时生效） | number | — | 24 |
| cols | 终端默认列数（未开启 fit 或容器不可见时生效） | number | — | 80 |
| readOnly | 只读模式，开启后拦截用户键盘输入 | boolean | — | false |
| autoFit | 是否随容器尺寸变化自动自适应调整网格 | boolean | — | true |

### Events

| 事件名称 | 说明 | 回调参数 |
|---|---|---|
| init | 终端实例初始化完毕时触发 | `(term: Terminal)` |
| data | 用户在终端输入产生字符流时触发 | `(data: string)` |
| resize | 终端行列尺寸发生变化时触发 | `({ cols: number, rows: number })` |

### Methods

| 方法名 | 说明 | 参数 |
|---|---|---|
| write | 向终端写入原始字符流 | `(data: string \| Uint8Array)` |
| writeln | 向终端写入一行字符（末尾自动追加换行） | `(data: string)` |
| clear | 清空当前终端视口内容 | — |
| fit | 强制触发终端自适应外层容器尺寸 | — |
| focus | 聚焦终端输入框 | — |
| blur | 终端失去焦点 | — |
| getTerminal | 获取底层原生 xterm `Terminal` 实例 | — |
