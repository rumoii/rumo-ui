## Terminal

Interactive Web terminal component based on `xterm@5.3.0` and `xterm-addon-fit@0.8.0`. Designed for cloud-native dashboards, Web SSH, local AI Agent / CLI developer tooling, and bidirectional command-line workflows.

:::tip Architecture & Version Pinning Note
1. **Pinned Dependency**: Exact version lock on `xterm@5.3.0` and `xterm-addon-fit@0.8.0` (strictly without `^` or `~` in `package.json`).
2. **Root Cause**: Starting with xterm 5.4.0 and the official scoped `@xterm/*` packages, upstream introduced ES2020 optional chaining syntax (`?.`). The `rumo-ui` build toolchain relies on Webpack 4.47.0 and Babel 6, where the bundled Acorn 6 parser cannot parse ES2020 optional chaining (`Module parse failed: Unexpected token`). To preserve toolchain stability and avoid build fragmentation, this repository rejects adding `esbuild-loader`.
3. **Migration Plan**: Upgrading to `@xterm/xterm` and `@xterm/addon-fit` latest will be executed during the project-wide upgrade to Vue 3 + Webpack 5 + Babel 7.
:::

### Basic Usage & Output

Initialize the terminal with a blinking cursor, ANSI color streams, and common programmatic methods.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="handlePrintBanner">Print Banner</rumo-button>
      <rumo-button size="small" @click="handleClear">Clear</rumo-button>
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

### Interactive Shell Simulation

Listen to the `@data` event to capture keystrokes and implement a lightweight interactive shell with echo, newlines, and backspace deletion.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px; font-size: 13px; color: #666;">
      Tip: Click the terminal and type commands (e.g. <code>help</code>, <code>date</code>, or <code>clear</code> then press Enter).
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

      // Enter
      if (data === '\r') {
        term.writeln('');
        this.executeCommand(this.currentLine.trim());
        this.currentLine = '';
        term.write('$ ');
      }
      // Backspace
      else if (data === '\u007f' || data === '\b') {
        if (this.currentLine.length > 0) {
          this.currentLine = this.currentLine.slice(0, -1);
          term.write('\b \b');
        }
      }
      // Printable characters
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

### Container Auto-Fit

Enabled by default via `autoFit`. When container width or height changes, the component leverages `ResizeObserver` to trigger `fit()` automatically. You can also invoke `fit()` imperatively.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" @click="toggleContainerWidth">
        Toggle Width: {{ containerWidth }}
      </rumo-button>
      <rumo-button size="small" @click="handleManualFit">Call fit()</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">
        Grid: {{ gridInfo }}
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

### Read-Only Mode & Custom Theme

Use `readOnly` to disable keyboard input. Customize terminal colors and styling via `options.theme`.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-checkbox v-model="isReadOnly">Read-Only Mode (readOnly)</rumo-checkbox>
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

| Attribute | Description | Type | Accepted Values | Default |
|---|---|---|---|---|
| options | Native xterm `ITerminalOptions` configuration | object | — | Default dark theme |
| rows | Default row count when auto-fit is disabled | number | — | 24 |
| cols | Default column count when auto-fit is disabled | number | — | 80 |
| readOnly | Whether the terminal is in read-only mode | boolean | — | false |
| autoFit | Automatically resize terminal grid on container size changes | boolean | — | true |

### Events

| Event Name | Description | Parameters |
|---|---|---|
| init | Triggered when the terminal instance is fully initialized | `(term: Terminal)` |
| data | Triggered when keystrokes or data are received from the terminal | `(data: string)` |
| resize | Triggered when rows or cols are resized | `({ cols: number, rows: number })` |

### Methods

| Method | Description | Parameters |
|---|---|---|
| write | Write raw data to the terminal | `(data: string \| Uint8Array)` |
| writeln | Write a line of data to the terminal with a newline | `(data: string)` |
| clear | Clear the terminal screen | — |
| fit | Manually trigger fit to container geometry | — |
| focus | Focus the terminal | — |
| blur | Remove focus from the terminal | — |
| getTerminal | Return the underlying native xterm `Terminal` instance | — |
