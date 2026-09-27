# Rumo UI

基于 Vue 的企业级后台基础组件库。

在产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，给设计师和工程师带来很多困扰和重复建设，大大降低了产品的研发效率。我们经过大量的项目实践和总结，沉淀出一个设计语言 Rumo Design。旨在统一项目的前端 UI 设计，屏蔽不必要的设计差异和实现成本，解放设计和前端的研发资源。

## 快速上手

### 安装

```shell
npm i rumo-ui -S
```

### 引入

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'

Vue.use(RumoUI)

// or
import {
  Select,
  Button
  // ...
} from 'rumo-ui'

Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
```

### 全局配置

在引入 Rumo UI 时，可以传入一个全局配置对象。该对象目前仅支持 size 字段，用于改变组件的默认尺寸。按照引入方式，具体操作如下：

完整引入：

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'
Vue.use(RumoUI, { size: 'small' })
```

按照以上设置，项目中所有拥有 size 属性的组件的默认尺寸均为 'small'。

## 开发

```shell
npm run bootstrap   # 安装依赖
npm run dev         # 启动文档站（http://localhost:8085）
npm run build       # 构建产物（lib/）
```

## 融合来源与许可

Rumo UI 融合了多个优秀开源项目的组件与资产，均在文件头与 `NOTICE` 中标注来源：

| 上游项目 | 许可 | 融合内容 |
| --- | --- | --- |
| Element UI | MIT | 组件库血统基座 |
| Element Plus | MIT | 缺口组件回移（文本 / 水印 / 结果 / 间距 / 分段 / 骨架屏 / 描述列表 / 统计 / 倒计时 / 头像组等 13 件） |
| splitpanes（v2.4.1） | MIT | 分栏面板 |
| vue-signature-pad + signature_pad | MIT | 手写签名 |
| qrcode | MIT | 二维码生成 |
| animejs | MIT | 动效引擎（Animate 组件与 v-animate 指令） |
| countup.js | MIT | 数字滚动 |
| AOS | MIT | 滚动显现（精简重写，未引入其运行时） |
| Tabler Icons | MIT | 精选 500 个 SVG 图标（SvgIcon 组件） |

**许可合规说明**：以上项目均为 MIT / Apache-2.0 宽松许可，与本库 MIT 许可完全兼容。每个移植文件的头部均标注上游项目与版本；根目录 `NOTICE` 为来源索引；`licenses/` 目录保存各上游的完整许可文本。所有合入代码均随副本保留版权与许可声明，**完全符合各上游许可要求**。其中 animejs、countup.js、signature_pad、qrcode 以 npm 依赖方式引用，未拷贝其源码。

## License

MIT
