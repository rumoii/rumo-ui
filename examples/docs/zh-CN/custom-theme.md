## 自定义主题

Rumo UI 的样式在 `packages/theme-chalk/src` 下，用 SCSS 编写，CSS 命名采用 BEM 风格，方便覆盖。主题色等基础值来自 Design Tokens：`tokens/tokens.json` 是唯一来源，`scripts/gen-tokens.js` 由它生成 `packages/theme-chalk/src/common/tokens.scss`，再由 `common/var.scss` 引用。

下面两种方法任选其一。看板组件的可选皮肤（Dash）另有一套运行时 CSS 变量，见「Dash 皮肤令牌」。

### 方法一：在你的项目里覆盖 SCSS 变量

适用于你的项目已经在用 SCSS。`var.scss` 里的变量都带 `!default`，在引入主题源码之前先赋值即可覆盖。

新建一个样式文件，例如 `rumo-variables.scss`：

```scss
/* 改变主题色 */
$--color-primary: teal;

/* 改变 icon 字体路径，必需 */
$--font-path: '~rumo-ui/lib/theme-chalk/fonts';

@import "~rumo-ui/packages/theme-chalk/src/index";
```

然后在入口文件里引入它，不再引入编译好的 `lib/theme-chalk/index.css`：

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'
import './rumo-variables.scss'

Vue.use(RumoUI)
```

:::tip
- 必须覆盖字体路径变量 `$--font-path`，指向 Rumo UI 的 icon 字体所在目录。
- 主题源码使用了 `@use 'sass:math'`，需要用 Dart Sass（npm 包 `sass`）编译，不支持 node-sass。
:::

全部可覆盖的变量见 `packages/theme-chalk/src/common/var.scss`，例如：

```scss
$--color-primary: $--token-color-primary !default;
$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;
$--color-success: $--token-color-success !default;
$--color-warning: $--token-color-warning !default;
$--color-danger: $--token-color-danger !default;
$--color-info: $--token-color-info !default;
```

### 方法二：修改 Design Tokens 后重新构建

适用于你直接使用本仓库，或者想得到一份新的编译好的 CSS。

1. 编辑 `tokens/tokens.json`，例如修改 `color.primary.hex`。
2. 在仓库根目录执行：

```shell
npm run build:theme   # 生成 tokens.scss，并编译样式到 lib/theme-chalk
```

3. 像引入默认主题一样引入 `lib/theme-chalk/index.css`，或者按需引入 `lib/theme-chalk/<组件名>.css`。

:::tip
`tokens.scss` 等生成文件的文件头写明了"Do not edit directly"，不要手工修改，改 `tokens/tokens.json` 后重新生成。
:::
