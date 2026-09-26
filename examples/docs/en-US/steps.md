[toc]

## Steps 步骤条
引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。

### 基础用法

简单的步骤条。

:::demo 设置`active`属性，接受一个`Number`，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置`space`属性即可，它接受`Boolean`，单位为`px`，如果不设置，则为自适应。设置`finish-status`属性可以改变已经完成的步骤的状态。
```html
<rumo-steps :active="active" finish-status="success" :type="type">
  <rumo-step title="步骤 1"></rumo-step>
  <rumo-step title="步骤 2"></rumo-step>
  <rumo-step title="步骤 3"></rumo-step>
</rumo-steps>

<rumo-button style="margin-top: 12px;" @click="next">下一步</rumo-button>
<rumo-button style="margin-top: 12px;" @click="changeType">换肤</rumo-button>
<script>
  export default {
    data() {
      return {
        type: 'line',
        active: 0
      };
    },

    methods: {
      changeType() {
        this.type = this.type === 'tail' ? 'line' : 'tail'
      },
      next() {
        if (this.active++ > 2) this.active = 0;
      }
    }
  }
</script>
```
:::

### 含状态步骤条

每一步骤显示出该步骤的状态。

:::demo 也可以使用`title`具名分发，可以用`slot`的方式来取代属性的设置，在本文档最后的列表中有所有的 slot name 可供参考。
```html
<rumo-steps :space="200" :active="1" finish-status="success" :type="type">
  <rumo-step title="已完成"></rumo-step>
  <rumo-step title="进行中"></rumo-step>
  <rumo-step title="步骤 3"></rumo-step>
</rumo-steps>
<script>
  export default {
    data() {
      return {
        type: 'line'
      };
    }
  }
</script>
```
:::

### 有描述的步骤条

每个步骤有其对应的步骤状态描述。

:::demo
```html
<rumo-steps :active="1" :type="type">
  <rumo-step title="步骤 1" description="这是一段很长很长很长的描述性文字"></rumo-step>
  <rumo-step title="步骤 2" description="这是一段很长很长很长的描述性文字"></rumo-step>
  <rumo-step title="步骤 3" description="这段就没那么长了"></rumo-step>
</rumo-steps>
<script>
  export default {
    data() {
      return {
        type: 'line'
      };
    }
  }
</script>
```
:::

### 居中的步骤条

标题和描述都将居中。

:::demo
```html
<rumo-steps :active="2" align-center :type="type">
  <rumo-step title="步骤1" description="这是一段很长很长很长的描述性文字"></rumo-step>
  <rumo-step title="步骤2" description="这是一段很长很长很长的描述性文字"></rumo-step>
  <rumo-step title="步骤3" description="这是一段很长很长很长的描述性文字"></rumo-step>
  <rumo-step title="步骤4" description="这是一段很长很长很长的描述性文字"></rumo-step>
</rumo-steps>
<script>
  export default {
    data() {
      return {
        type: 'line'
      };
    }
  }
</script>
```
:::

### 带图标的步骤条
步骤条内可以启用各种自定义的图标。

:::demo 通过`icon`属性来设置图标，图标的类型可以参考 Icon 组件的文档，除此以外，还能通过具名`slot`来使用自定义的图标。
```html

<rumo-steps :active="1" :type="type">
  <rumo-step title="步骤 1" icon="rumo-icons icon-edit"></rumo-step>
  <rumo-step title="步骤 2" icon="rumo-icons icon-upload"></rumo-step>
  <rumo-step title="步骤 3" icon="rumo-icons icon-report"></rumo-step>
</rumo-steps>
<script>
  export default {
    data() {
      return {
        type: 'line'
      };
    }
  }
</script>
```
:::

### 竖式步骤条

竖直方向的步骤条。

:::demo 只需要在`rumo-steps`元素中设置`direction`属性为`vertical`即可。
```html
<div style="height: 300px;">
  <rumo-steps direction="vertical" :active="1">
    <rumo-step title="步骤 1"></rumo-step>
    <rumo-step title="步骤 2"></rumo-step>
    <rumo-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></rumo-step>
  </rumo-steps>
</div>
```
:::

### 简洁风格的步骤条
设置 `simple` 可应用简洁风格，该条件下 `align-center` / `description` / `direction` / `space` 都将失效。

:::demo
```html

<rumo-steps :active="1" simple>
  <rumo-step title="步骤 1" icon="rumo-icons icon-edit"></rumo-step>
  <rumo-step title="步骤 2" icon="rumo-icons icon-upload"></rumo-step>
  <rumo-step title="步骤 3" icon="rumo-icons icon-report"></rumo-step>
</rumo-steps>

<rumo-steps :active="1" finish-status="success" simple style="margin-top: 20px">
  <rumo-step title="步骤 1" ></rumo-step>
  <rumo-step title="步骤 2" ></rumo-step>
  <rumo-step title="步骤 3" ></rumo-step>
</rumo-steps>
```
:::

### Steps Attributes

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| space | 每个 step 的间距，不填写将自适应间距。支持百分比。 | number / string | — | — |
| direction | 显示方向 | string | vertical/horizontal | horizontal |
| active | 设置当前激活步骤  | number | — | 0 |
| process-status | 设置当前步骤的状态 | string | wait / process / finish / error / success | process |
| finish-status | 设置结束步骤的状态 | string | wait / process / finish / error / success | finish |
| align-center | 进行居中对齐 | boolean | - | false |
| simple | 是否应用简洁风格 | boolean | - | false |

### Step Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| title | 标题 | string | — | — |
| description | 描述性文字 | string | — | — |
| icon | 图标 | 传入 icon 的 class 全名来自定义 icon，也支持 slot 方式写入 | string | — |
| status | 设置当前步骤的状态，不设置则根据 steps 确定状态 | wait / process / finish / error / success | - |

### Step Slot
| name | 说明  |
|----|----|
| icon | 图标 |
| title | 标题 |
| description | 描述性文字 |
