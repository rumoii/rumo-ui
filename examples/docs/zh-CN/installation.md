
[toc]

## 安装

Rumo UI 目前**没有发布到 npm**。下面的方式都基于本仓库源码。

### 克隆并构建

```shell
git clone https://github.com/rumoii/rumo-ui.git
cd rumo-ui
npm run bootstrap   # 安装依赖
npm run build       # 构建产物到 lib/
```

构建需要 Node.js 20（见仓库 `.nvmrc`）。主要产物：

| 文件 | 内容 |
| --- | --- |
| `lib/index.js` | 完整组件库，UMD 格式，全局变量名 `RUMO` |
| `lib/rumo-ui.common.js` | 完整组件库，CommonJS 格式 |
| `lib/<组件名>.js` | 单个组件，用于按需引入 |
| `lib/theme-chalk/index.css` | 完整样式 |
| `lib/theme-chalk/<组件名>.css` | 单个组件的样式 |

### 在自己的项目中安装

在构建好的仓库目录里打包，再把生成的压缩包装进你的项目：

```shell
# 在 rumo-ui 仓库目录
npm pack            # 生成 rumo-ui-<版本号>.tgz

# 在你的项目目录
npm i /path/to/rumo-ui-<版本号>.tgz -S
```

之后的用法见下一节：快速上手。项目需要使用 Vue 2.6，Rumo UI 不支持 Vue 3。

### 直接用 script 标签引入

把构建产物 `lib/index.js` 和 `lib/theme-chalk/index.css` 复制到你的静态资源目录，然后在页面上引入。页面里已有全局 `Vue` 时，组件会自动注册。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- 引入样式 -->
  <link rel="stylesheet" href="./rumo-ui/theme-chalk/index.css">
</head>
<body>
  <div id="app">
    <rumo-button @click="visible = true">按钮</rumo-button>
    <rumo-dialog :visible.sync="visible" title="Hello world">
      <p>欢迎使用 Rumo UI</p>
    </rumo-dialog>
  </div>
</body>
  <!-- 先引入 Vue 2.6 -->
  <script src="./vue.js"></script>
  <!-- 再引入组件库 -->
  <script src="./rumo-ui/index.js"></script>
  <script>
    new Vue({
      el: '#app',
      data: function() {
        return { visible: false }
      }
    })
  </script>
</html>
```

### 只复用单个组件

只需要某一个组件时，可以直接把它的源码拿到自己的项目里：

- 组件源码：`packages/<组件名>/`
- 组件样式：`packages/theme-chalk/src/<组件名>.scss`，以及它 `@import` 的 `common/var.scss`、`mixins/` 等文件
- 组件引用的公共代码：`src/` 下被 `import` 的文件，例如 `src/utils/`、`src/mixins/`

先查看组件源码的 `import` 和样式的 `@import`，把它依赖的文件一并带上。
