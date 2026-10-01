## LogViewer

Used to display terminal logs, CI/CD execution streams, and real-time execution outputs from local AI models or Agents. Powered by virtual scrolling and lightweight ANSI parsing, supporting smooth rendering of large log streams.

### Basic usage

Display static log content with native ANSI color parsing and line numbers.

:::demo
```html
<template>
  <rumo-log-viewer
    :data="logs"
    height="260px"
    title="Build Pipeline"
  />
</template>

<script>
export default {
  data() {
    return {
      logs: [
        '\x1b[36m[INFO]\x1b[0m Initializing rumo-ui build environment...',
        '\x1b[36m[INFO]\x1b[0m Loading Design Tokens from tokens/tokens.json...',
        '\x1b[32m[SUCCESS]\x1b[0m Design tokens compiled successfully.',
        '\x1b[33m[WARN]\x1b[0m Browserslist data is older than 6 months.',
        '\x1b[36m[INFO]\x1b[0m Compiling 107 packages with webpack 4...',
        '\x1b[32m[SUCCESS]\x1b[0m All components compiled with 0 errors.',
        '\x1b[35m[AGENT]\x1b[0m Tool call completed: run_shell_command'
      ]
    };
  }
};
</script>
```
:::

### Live streaming & auto follow

Simulate live log streaming using interval updates. When `follow` is enabled, newly written logs automatically trigger smooth scroll-to-bottom.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="toggleStream">
        {{ timer ? 'Stop Stream' : 'Start Stream' }}
      </rumo-button>
      <rumo-button size="small" @click="clearLogs">Clear Logs</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">
        Lines: {{ streamLogs.length }}
      </span>
    </div>
    <rumo-log-viewer
      :data="streamLogs"
      height="280px"
      title="Live Agent Stream"
      :follow="true"
      @clear="clearLogs"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      count: 0,
      streamLogs: [
        '\x1b[32m[READY]\x1b[0m Agent listener initialized.'
      ]
    };
  },
  beforeDestroy() {
    this.stopStream();
  },
  methods: {
    toggleStream() {
      if (this.timer) {
        this.stopStream();
      } else {
        this.startStream();
      }
    },
    startStream() {
      this.timer = setInterval(() => {
        this.count++;
        const now = new Date().toTimeString().split(' ')[0];
        const statusColors = ['\x1b[32m[OK]\x1b[0m', '\x1b[36m[TASK]\x1b[0m', '\x1b[33m[DEBUG]\x1b[0m'];
        const tag = statusColors[this.count % statusColors.length];
        this.streamLogs.push(`${tag} ${now} - Agent executing tick #${this.count}`);
      }, 500);
    },
    stopStream() {
      clearInterval(this.timer);
      this.timer = null;
    },
    clearLogs() {
      this.streamLogs = [];
      this.count = 0;
    }
  }
};
</script>
```
:::

### Keyword filtering

Filter logs dynamically via the `filter` prop while preserving the original line numbers.

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px; width: 240px;">
      <rumo-input
        v-model="keyword"
        size="small"
        placeholder="Filter keyword (e.g. WARN/ERROR)"
        clearable
      />
    </div>
    <rumo-log-viewer
      :data="logList"
      :filter="keyword"
      height="240px"
      title="System Filtered Output"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      logList: [
        '[INFO] Service registry connecting to 127.0.0.1:8080...',
        '\x1b[32m[INFO]\x1b[0m Connection established successfully.',
        '\x1b[33m[WARN]\x1b[0m Response latency exceeds 200ms threshold.',
        '\x1b[31m[ERROR]\x1b[0m Failed to ping downstream service: timeout.',
        '[INFO] Retrying connection attempt #2...',
        '\x1b[32m[SUCCESS]\x1b[0m Downstream acknowledged ping probe.'
      ]
    };
  }
};
</script>
```
:::

### Light theme

Switch to light console styling by setting `theme="light"`.

:::demo
```html
<template>
  <rumo-log-viewer
    :data="lightLogs"
    theme="light"
    height="200px"
    title="Light Mode Console"
  />
</template>

<script>
export default {
  data() {
    return {
      lightLogs: [
        '\x1b[34m[HTTP]\x1b[0m GET /api/v1/models/list 200 OK - 12ms',
        '\x1b[32m[AUTH]\x1b[0m Token verified for user admin',
        '\x1b[33m[CACHE]\x1b[0m Redis hit ratio: 89.4%'
      ]
    };
  }
};
</script>
```
:::

### LogViewer Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- |
| data | Log data source, string or string array | string / string[] | — | [] |
| height | Container height | string / number | — | '400px' |
| follow | Auto scroll to bottom when new logs arrive | boolean | — | true |
| ansi | Whether to parse ANSI color escape codes | boolean | — | true |
| wrap | Whether to wrap long lines | boolean | — | false |
| filter | Keyword filter (case-insensitive) | string | — | '' |
| theme | Theme mode | string | dark / light | dark |
| show-line-number | Whether to show line numbers | boolean | — | true |
| title | Header bar title | string | — | '' |
| loading | Loading overlay state | boolean | — | false |
| empty-text | Text displayed when logs are empty | string | — | 'No logs available' |

### Events

| Event Name | Description | Parameters |
| --- | --- | --- |
| scroll-top | Triggered when scrolled to the top | — |
| scroll-bottom | Triggered when scrolled to the bottom | — |
| clear | Triggered when clear button is clicked | — |
| copy | Triggered when copy button is clicked | (rawText: string) |

### Slots

| Slot Name | Description |
| --- | --- |
| header | Custom header toolbar |
| empty | Custom empty state content |

### Methods

| Method | Description | Parameters |
| --- | --- | --- |
| scrollToBottom | Scroll to bottom | — |
| scrollToTop | Scroll to top | — |
| getRawText | Get visible/filtered raw text | — |
