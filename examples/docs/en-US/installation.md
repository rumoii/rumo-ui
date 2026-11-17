
[toc]

## Installation

Rumo UI is **not published to npm** yet. All the options below start from the source in this repository.

### Clone and build

```shell
git clone https://github.com/rumoii/rumo-ui.git
cd rumo-ui
npm run bootstrap   # install dependencies
npm run build       # build into lib/
```

Building requires Node.js 20 (see `.nvmrc` in the repository). Main outputs:

| File | Content |
| --- | --- |
| `lib/index.js` | Full library, UMD, global name `RUMO` |
| `lib/rumo-ui.common.js` | Full library, CommonJS |
| `lib/<component>.js` | A single component, for on-demand import |
| `lib/theme-chalk/index.css` | Full stylesheet |
| `lib/theme-chalk/<component>.css` | Stylesheet of a single component |

### Install into your project

Pack the built repository, then install the tarball into your project:

```shell
# in the rumo-ui repository
npm pack            # creates rumo-ui-<version>.tgz

# in your project
npm i /path/to/rumo-ui-<version>.tgz -S
```

Continue with the next section, Quick Start. Your project must use Vue 2.6; Rumo UI does not support Vue 3.

### Script tags

Copy the built `lib/index.js` and `lib/theme-chalk/index.css` into your static assets and include them in the page. When a global `Vue` exists, the components register themselves.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- styles -->
  <link rel="stylesheet" href="./rumo-ui/theme-chalk/index.css">
</head>
<body>
  <div id="app">
    <rumo-button @click="visible = true">Button</rumo-button>
    <rumo-dialog :visible.sync="visible" title="Hello world">
      <p>Try Rumo UI</p>
    </rumo-dialog>
  </div>
</body>
  <!-- Vue 2.6 first -->
  <script src="./vue.js"></script>
  <!-- then the component library -->
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

### Reuse a single component

To take only one component into your own project, copy its source:

- Component source: `packages/<component>/`
- Component styles: `packages/theme-chalk/src/<component>.scss`, plus the files it `@import`s, such as `common/var.scss` and `mixins/`
- Shared code the component imports from `src/`, such as `src/utils/` and `src/mixins/`

Follow the component's `import` statements and the stylesheet's `@import` statements, and bring every file they depend on.
