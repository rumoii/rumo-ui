<template>
  <div
    class="rumo-log-viewer"
    :class="[
      `rumo-log-viewer--${theme}`,
      {
        'is-wrap': wrap,
        'is-loading': loading
      }
    ]"
    :style="{ height: computedHeight }"
  >
    <!-- 头部工具栏 -->
    <div v-if="hasHeader" class="rumo-log-viewer__header">
      <slot name="header">
        <div class="rumo-log-viewer__title">
          <span class="rumo-log-viewer__title-indicator"></span>
          <span>{{ title || 'Log Output' }}</span>
          <span v-if="processedLines.length" class="rumo-log-viewer__count">({{ processedLines.length }} lines)</span>
        </div>
        <div class="rumo-log-viewer__actions">
          <button
            type="button"
            class="rumo-log-viewer__action-btn"
            title="Copy logs"
            @click="handleCopy"
          >
            Copy
          </button>
          <button
            type="button"
            class="rumo-log-viewer__action-btn"
            title="Clear logs"
            @click="handleClear"
          >
            Clear
          </button>
        </div>
      </slot>
    </div>

    <!-- 虚拟列表视口 -->
    <div class="rumo-log-viewer__body">
      <virtual-list
        v-if="processedLines.length"
        ref="virtualList"
        class="rumo-log-viewer__virtual-list"
        :data-key="'id'"
        :data-sources="processedLines"
        :data-component="itemComponent"
        :extra-props="{ wrap, showLineNumber }"
        :keeps="40"
        :estimate-size="22"
        @totop="handleToTop"
        @tobottom="handleToBottom"
      />
      <div v-else class="rumo-log-viewer__empty">
        <slot name="empty">
          <span>{{ emptyText || 'No logs available' }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
import LogViewerItem from './item.vue';
import Convert from 'ansi-to-html';

export default {
  name: 'RumoLogViewer',

  components: {
    'virtual-list': VirtualList
  },

  props: {
    data: {
      type: [Array, String],
      default() {
        return [];
      }
    },
    height: {
      type: [String, Number],
      default: '400px'
    },
    follow: {
      type: Boolean,
      default: true
    },
    ansi: {
      type: Boolean,
      default: true
    },
    wrap: {
      type: Boolean,
      default: false
    },
    filter: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'dark',
      validator(val) {
        return ['dark', 'light'].indexOf(val) !== -1;
      }
    },
    showLineNumber: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      itemComponent: LogViewerItem
    };
  },

  computed: {
    hasHeader() {
      return Boolean(this.title || this.$slots.header);
    },
    computedHeight() {
      return typeof this.height === 'number' ? `${this.height}px` : this.height;
    },
    rawLines() {
      if (typeof this.data === 'string') {
        return this.data ? this.data.split(/\r?\n/) : [];
      }
      if (Array.isArray(this.data)) {
        return this.data;
      }
      return [];
    },
    processedLines() {
      const filterKey = this.filter ? this.filter.trim().toLowerCase() : '';
      const result = [];
      const len = this.rawLines.length;

      for (let i = 0; i < len; i++) {
        const rawLine = String(this.rawLines[i]);
        if (filterKey && rawLine.toLowerCase().indexOf(filterKey) === -1) {
          continue;
        }

        result.push({
          id: i,
          lineNumber: i + 1,
          raw: rawLine,
          html: this.parseLine(rawLine)
        });
      }

      return result;
    }
  },

  watch: {
    'processedLines.length'() {
      if (this.follow) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    }
  },

  created() {
    this.converter = new Convert({
      escapeXML: true,
      newline: false
    });
    // 行级缓存 Map<string, string>，避免对长日志反复转译
    this.lineCache = new Map();
  },

  methods: {
    escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    parseLine(line) {
      if (!line) {
        return '&nbsp;';
      }

      if (!this.ansi) {
        return this.escapeHtml(line);
      }

      // 命中缓存则直接返回
      if (this.lineCache.has(line)) {
        return this.lineCache.get(line);
      }

      // 缓存上限保护：防止内存无限增长
      if (this.lineCache.size > 3000) {
        this.lineCache.clear();
      }

      try {
        const html = this.converter.toHtml(line) || '&nbsp;';
        this.lineCache.set(line, html);
        return html;
      } catch (e) {
        const fallback = this.escapeHtml(line);
        this.lineCache.set(line, fallback);
        return fallback;
      }
    },

    scrollToBottom() {
      const vl = this.$refs.virtualList;
      if (vl && typeof vl.scrollToBottom === 'function') {
        vl.scrollToBottom();
      }
    },

    scrollToTop() {
      const vl = this.$refs.virtualList;
      if (vl && typeof vl.scrollToOffset === 'function') {
        vl.scrollToOffset(0);
      }
    },

    getRawText() {
      return this.processedLines.map(item => item.raw).join('\n');
    },

    handleToTop() {
      this.$emit('scroll-top');
    },

    handleToBottom() {
      this.$emit('scroll-bottom');
    },

    handleClear() {
      this.lineCache.clear();
      this.$emit('clear');
    },

    handleCopy() {
      const text = this.getRawText();
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      this.$emit('copy', text);
    }
  }
};
</script>
