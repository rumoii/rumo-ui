## Result 结果

用于反馈操作结果的页面级组件,支持五种状态图标与自定义标题/副标题/操作区。

### 基础用法

:::demo

```html
<rumo-result icon="success" title="提交成功" sub-title="你的申请已进入审批流程">
</rumo-result>
```

:::

### 不同状态

`icon` 支持 `primary` / `success` / `warning` / `error` / `info`。

:::demo

```html
<div>
  <rumo-result icon="error" title="提交失败" sub-title="网络异常,请稍后重试"></rumo-result>
  <rumo-result icon="warning" title="警告提示" sub-title="当前操作存在风险"></rumo-result>
</div>
```

:::

### 自定义内容

通过插槽自定义图标、标题、副标题与底部操作区。

:::demo

```html
<rumo-result icon="info" title="自定义结果页">
  <template slot="sub-title">
    <rumo-text type="info" size="small">副标题支持富内容插槽</rumo-text>
  </template>
  <template slot="extra">
    <rumo-button type="primary">返回首页</rumo-button>
    <rumo-button>查看详情</rumo-button>
  </template>
</rumo-result>
```

:::

### Result Attributes

| 参数      | 说明           | 类型   | 可选值                                     | 默认值 |
| --------- | -------------- | ------ | ------------------------------------------ | ------ |
| title     | 标题           | string | —                                          | —      |
| sub-title | 副标题         | string | —                                          | —      |
| icon      | 状态图标类型   | string | primary / success / warning / error / info | info   |

### Slots

| 名称      | 说明           |
| --------- | -------------- |
| icon      | 自定义图标     |
| title     | 自定义标题     |
| sub-title | 自定义副标题   |
| extra     | 底部操作区     |
