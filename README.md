# Rumo UI

基于 Vue 的企业级后台基础组件库。

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

## License

MIT
