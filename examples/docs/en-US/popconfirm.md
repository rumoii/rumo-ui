[toc]

## PopConfirm 确认框

激活元素，弹出气泡式的确认框

### 基础用法

PopConfirm 的属性与 Tooltip 很类似，它们都是基于Vue-popper开发的，因此对于重复属性，请参考 Tooltip 的文档，在此文档中不做详尽解释。

:::demo `trigger`属性用于设置何时触发 Popover，支持四种触发方式：`hover`，`click` 和 `manual`。对于触发 PopConfirm 的元素，有两种写法：使用 `slot="reference"` 的具名插槽，或使用自定义指令`v-popconfirm`指向 popconfirm 的索引`ref`。
```html
<rumo-button-group>
  <rumo-popconfirm :title="title"
    :content="message"
    trigger="click"
    :on-confirm="handleConfirm"
    :on-cancel="handleCancel">
    <rumo-button slot="reference">click 激活</rumo-button>
  </rumo-popconfirm>

  <rumo-popconfirm :title="title"
    :content="message"
    trigger="hover"
    :on-confirm="handleConfirm"
    :on-cancel="handleCancel">
    <rumo-button slot="reference">hover 激活</rumo-button>
  </rumo-popconfirm>

  <rumo-popconfirm ref="popconfirm"
    :title="title"
    :content="message"
    trigger="click"
    :on-confirm="handleConfirm"
    :on-cancel="handleCancel">
  </rumo-popconfirm>

  <rumo-button v-popconfirm:popconfirm>通过 v-popconfirm 指向激活</rumo-button>
</rumo-button-group>

<script>
  export default {
    data() {
      return {
        state: {
          visible: false,
          condition: true
        },
        title: '操作提示',
        message: '确定要删除这个任务吗？'
      }
    },
    methods: {
      handleConfirm() {
        this.$message.success('点击了确定');
      },
      handleCancel() {
        this.$message.error('点击了取消');
      }
    }
  }
</script>
```
:::

### 自定义模板

可自定义配置不同内容。

:::demo
```html
  <rumo-popconfirm
    title="确定要操作？"
    trigger="click"
    :width="350"
    size="small"
    :on-confirm="handleConfirm"
    :on-cancel="handleCancel">
    <template slot="message">
      <p>执行该操作后，以下信息将发生变化：</p>
      <ol class="demo-popconfirm-ol">
        <li><strong>与现实生活一致：</strong>与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</li>
        <li><strong>在界面中一致：</strong>所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</li>
      </ol>
    </template>
    <rumo-button slot="reference">click 激活</rumo-button>
  </rumo-popconfirm>
<script>
  export default {
    methods: {
      handleConfirm() {
        this.$message.success('点击了确定');
      },
      handleCancel() {
        this.$message.error('点击了取消');
      },
    }
  }
</script>
```
:::

### 偏移

:::demo 在这里我们提供 9 种不同方向的展示方式，可以通过以下完整示例来理解，选择你要的效果。
```html
<div class="box">
  <div class="top">
    <rumo-popconfirm class="item" trigger="click" content="Top Left 提示文字" placement="top-start">
      <rumo-button slot="reference">上左</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Top Center 提示文字" placement="top">
      <rumo-button slot="reference">上边</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Top Right 提示文字" placement="top-end">
      <rumo-button slot="reference">上右</rumo-button>
    </rumo-popconfirm>
  </div>
  <div class="left">
    <rumo-popconfirm class="item" trigger="click" content="Left Top 提示文字" placement="left-start">
      <rumo-button slot="reference">左上</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Left Center 提示文字" placement="left">
      <rumo-button slot="reference">左边</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Left Bottom 提示文字" placement="left-end">
      <rumo-button slot="reference">左下</rumo-button>
    </rumo-popconfirm>
  </div>

  <div class="right">
    <rumo-popconfirm class="item" trigger="click" content="Right Top 提示文字" placement="right-start">
      <rumo-button slot="reference">右上</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Right Center 提示文字" placement="right">
      <rumo-button slot="reference">右边</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Right Bottom 提示文字" placement="right-end">
      <rumo-button slot="reference">右下</rumo-button>
    </rumo-popconfirm>
  </div>
  <div class="bottom">
    <rumo-popconfirm class="item" trigger="click" content="Bottom Left 提示文字" placement="bottom-start">
      <rumo-button slot="reference">下左</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Bottom Center 提示文字" placement="bottom">
      <rumo-button slot="reference">下边</rumo-button>
    </rumo-popconfirm>
    <rumo-popconfirm class="item" trigger="click" content="Bottom Right 提示文字" placement="bottom-end">
      <rumo-button slot="reference">下右</rumo-button>
    </rumo-popconfirm>
  </div>
</div>
```
:::

### Attributes
| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
| trigger | 触发方式 | string | click / hover / manual | click |
| content | 显示的内容，也可以通过 slot 传入 DOM | string | — | 确定进行该操作？ |
| title | 确认框的标题 | string | — | - |
| width | 宽度 | number | — | 200 |
| size | 确认框操作按钮大小 | string | large / medium / default/ small / mini | mini |
| placement | 出现位置 | String | top / top-start / top-end / bottom / bottom-start / bottom-end / left / left-start / left-end / right / right-start / right-end | top |
| confirmText | 确认按钮文字 | string | — | 确定 |
| cancelText | 取消按钮文字 | string | — | 取消 |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| onConfirm | 点击确认的回调 | - |
| onCancel | 点击取消的回调 | - |

### Slot
| name | 说明 |
|------|--------|
| — | 自定义内容，需要在 `message` 中列出 `slot` |

## 注意

请确保 `PopConfirm` 的子元素能接受 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。

## 何时使用

目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。
和 `confirm` 弹出的全屏居中模态对话框相比，交互形式更轻量。