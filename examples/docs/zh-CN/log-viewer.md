## LogViewer 日志查看器

用于展示终端日志、CI/CD 执行流水、本地模型或 Agent 的实时执行日志流。基于虚拟滚动与轻量 ANSI 解析，支持海量日志流畅渲染。

### 基础用法

展示静态日志内容，原生支持 ANSI 色彩解析与行号展示。

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

### 动态流式日志与自动贴底

通过定时追加日志演示流式输出场景。开启 `follow` 时新日志写入自动平滑贴底滚动。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <rumo-button size="small" type="primary" @click="toggleStream">
        {{ timer ? '停止流式追加' : '开始流式追加' }}
      </rumo-button>
      <rumo-button size="small" @click="clearLogs">清空日志</rumo-button>
      <span style="margin-left: 12px; font-size: 13px; color: #666;">
        当前行数: {{ streamLogs.length }}
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

### 关键字过滤

通过 `filter` 属性过滤关键字，过滤后保留原始行号。

:::demo
```html
<template>
  <div>
    <div style="margin-bottom: 12px; width: 240px;">
      <rumo-input
        v-model="keyword"
        size="small"
        placeholder="输入关键字过滤(如 WARN/ERROR)"
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

### 明亮主题

通过设置 `theme="light"` 切换至白底浅色终端样式。

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

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| data | 日志数据源，支持数组或带换行的字符串 | string / string[] | — | [] |
| height | 容器高度 | string / number | — | '400px' |
| follow | 是否开启日志追加自动贴底滚动 | boolean | — | true |
| ansi | 是否解析 ANSI 终端色彩转义字符 | boolean | — | true |
| wrap | 日志行是否自动折行 | boolean | — | false |
| filter | 关键字过滤（忽略大小写） | string | — | '' |
| theme | 主题模式 | string | dark / light | dark |
| show-line-number | 是否展示行号 | boolean | — | true |
| title | 顶部栏标题 | string | — | '' |
| loading | 加载状态遮罩 | boolean | — | false |
| empty-text | 无日志时的提示文案 | string | — | 'No logs available' |

### Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| scroll-top | 滚动触顶时触发（可用于加载历史日志） | — |
| scroll-bottom | 滚动触底时触发 | — |
| clear | 点击清空按钮时触发 | — |
| copy | 点击复制按钮时触发 | (rawText: string) |

### Slots

| 插槽名称 | 说明 |
| --- | --- |
| header | 自定义顶部工具条 |
| empty | 自定义空状态内容 |

### Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| scrollToBottom | 滚动到底部 | — |
| scrollToTop | 滚动到顶部 | — |
| getRawText | 获取当前可见/过滤后的纯文本日志 | — |
