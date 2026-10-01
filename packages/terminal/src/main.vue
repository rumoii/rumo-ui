<!--
  =============================================================================
  RumoTerminal - Web 交互终端组件 (Phase 2)

  【xterm 版本锁定说明】
  当前精准锁定: xterm@5.3.0 与 xterm-addon-fit@0.8.0 (package.json 中严格无 ^ 或 ~)

  【锁定原因 (ES2020 可选链与 Webpack 4 / Babel 6 兼容性约束)】
  1. xterm 从 5.4.0 起及官方迁移目标 @xterm/xterm、@xterm/addon-fit 产物中全面引入了
     ES2020 可选链语法 (?.，例如 overviewRuler?.width、e?.translateToString())。
  2. 当前 rumo-ui 基础工程依赖 Webpack 4.47.0 与 Babel 6 (babel-core@6.26.3)。
     Webpack 4 内置的 Acorn 解析器最高支持 ES2019，在解析 ES2020 可选链时直接抛出:
     "Module parse failed: Unexpected token"。
  3. 为保持工程稳定性，项目明确拒绝引入 esbuild-loader (会引入 75+ 冗余依赖和编译链分裂)。
     因此 xterm 锁定在兼容 ES2019 的终极发布版 5.3.0，addon-fit 锁定在 0.8.0。

  【迁移时机】
  未来 rumo-ui 全库系统性升级至 Vue 3 + Webpack 5 + Babel 7 时，再统一升级至
  @xterm/xterm 与 @xterm/addon-fit 最新版本。
  =============================================================================
-->

<template>
  <div
    class="rumo-terminal"
    :class="{ 'is-readonly': readOnly }"
    ref="container"
  >
    <div class="rumo-terminal__inner" ref="terminalEl"></div>
    <div v-if="!initialized" class="rumo-terminal__placeholder">
      {{ t('rumo.terminal.emptyText') }}
    </div>
  </div>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import ResizeObserver from 'resize-observer-polyfill';
import Locale from 'rumo-ui/src/mixins/locale';

// 默认深色终端配色方案（与 Design Tokens tokens.json 对齐）
const DEFAULT_THEME = {
  background: '#1e1e1e',
  foreground: '#ffffff',
  cursor: '#ffffff',
  cursorAccent: '#1e1e1e',
  selectionBackground: 'rgba(255, 255, 255, 0.3)',
  selectionForeground: '#ffffff',
  black: '#000000',
  red: '#F45757',
  green: '#2ABC80',
  yellow: '#FF9c29',
  blue: '#856AF9',
  magenta: '#c678dd',
  cyan: '#56b6c2',
  white: '#d4d4d4',
  brightBlack: '#808080',
  brightRed: '#F45757',
  brightGreen: '#2ABC80',
  brightYellow: '#FF9c29',
  brightBlue: '#856AF9',
  brightMagenta: '#c678dd',
  brightCyan: '#56b6c2',
  brightWhite: '#ffffff'
};

export default {
  name: 'RumoTerminal',

  mixins: [Locale],

  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    rows: {
      type: Number,
      default: 24
    },
    cols: {
      type: Number,
      default: 80
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    autoFit: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      initialized: false
    };
  },

  watch: {
    readOnly(val) {
      if (this._term) {
        this._term.options.disableStdin = val;
      }
    },
    rows(val) {
      if (this._term) {
        this._term.resize(this._term.cols, val);
      }
    },
    cols(val) {
      if (this._term) {
        this._term.resize(val, this._term.rows);
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this._initTerminal();
    });
  },

  beforeDestroy() {
    this._destroy();
  },

  methods: {
    _initTerminal() {
      const el = this.$refs.terminalEl;
      if (!el) return;

      const userOptions = this.options || {};
      const mergedTheme = Object.assign({}, DEFAULT_THEME, userOptions.theme || {});
      const mergedOptions = Object.assign(
        {},
        {
          rows: this.rows,
          cols: this.cols,
          cursorBlink: true,
          cursorStyle: 'block',
          scrollback: 1000,
          tabStopWidth: 4,
          disableStdin: this.readOnly,
          fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
          fontSize: 14,
          lineHeight: 1.2
        },
        userOptions,
        { theme: mergedTheme }
      );

      const term = new Terminal(mergedOptions);
      this._term = term;

      const fitAddon = new FitAddon();
      this._fitAddon = fitAddon;
      term.loadAddon(fitAddon);

      term.open(el);

      this._disposables = [];

      this._disposables.push(
        term.onData(data => {
          this.$emit('data', data);
        })
      );

      this._disposables.push(
        term.onResize(size => {
          this.$emit('resize', { cols: size.cols, rows: size.rows });
        })
      );

      this.initialized = true;

      if (this.autoFit) {
        this._doFit();
        this._setupResizeObserver();
      }

      this.$emit('init', term);
    },

    _setupResizeObserver() {
      const container = this.$refs.container;
      if (!container) return;

      this._resizeObserver = new ResizeObserver(() => {
        if (this._fitTimer) {
          clearTimeout(this._fitTimer);
        }
        this._fitTimer = setTimeout(() => {
          this._doFit();
        }, 100);
      });

      this._resizeObserver.observe(container);
    },

    _doFit() {
      if (!this._fitAddon || !this._term) return;
      const el = this.$refs.terminalEl;
      if (!el || el.clientWidth === 0 || el.clientHeight === 0) return;

      try {
        this._fitAddon.fit();
      } catch (e) {
        // 在容器不可见或极端尺寸下静默处理
      }
    },

    _destroy() {
      // 1. 清理防抖定时器
      if (this._fitTimer) {
        clearTimeout(this._fitTimer);
        this._fitTimer = null;
      }

      // 2. 断开 ResizeObserver 监听
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }

      // 3. 注销所有 xterm 事件监听器
      if (this._disposables) {
        for (let i = 0; i < this._disposables.length; i++) {
          try {
            this._disposables[i].dispose();
          } catch (e) {
            // ignore
          }
        }
        this._disposables = null;
      }

      // 4. 销毁 FitAddon
      if (this._fitAddon) {
        try {
          this._fitAddon.dispose();
        } catch (e) {
          // ignore
        }
        this._fitAddon = null;
      }

      // 5. 销毁 Terminal 实例
      if (this._term) {
        try {
          this._term.dispose();
        } catch (e) {
          // ignore
        }
        this._term = null;
      }

      // 6. 清空容器 DOM 节点，断开引用防止 Detached DOM 泄露
      const el = this.$refs.terminalEl;
      if (el) {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      }

      this.initialized = false;
    },

    // 公开暴露方法 (Exposed Public Methods)
    write(data) {
      if (this._term) {
        this._term.write(data);
      }
    },

    writeln(data) {
      if (this._term) {
        this._term.writeln(data);
      }
    },

    clear() {
      if (this._term) {
        this._term.clear();
      }
    },

    fit() {
      this._doFit();
    },

    focus() {
      if (this._term) {
        this._term.focus();
      }
    },

    blur() {
      if (this._term) {
        this._term.blur();
      }
    },

    getTerminal() {
      return this._term || null;
    }
  }
};
</script>
