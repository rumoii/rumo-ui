## Custom Theme

Rumo UI's styles live in `packages/theme-chalk/src`, written in SCSS with BEM class names that are easy to override. Base values such as the primary color come from Design Tokens: `tokens/tokens.json` is the single source, `scripts/gen-tokens.js` generates `packages/theme-chalk/src/common/tokens.scss` from it, and `common/var.scss` uses that file.

Pick either method below. The optional dashboard skin (Dash) uses its own runtime CSS variables; see the Dash token page.

### Method 1: override SCSS variables in your project

For projects that already use SCSS. Every variable in `var.scss` is `!default`, so assigning it before importing the theme source overrides it.

Create a stylesheet such as `rumo-variables.scss`:

```scss
/* primary color */
$--color-primary: teal;

/* icon font path, required */
$--font-path: '~rumo-ui/lib/theme-chalk/fonts';

@import "~rumo-ui/packages/theme-chalk/src/index";
```

Import it in your entry file instead of the compiled `lib/theme-chalk/index.css`:

```javascript
import Vue from 'vue'
import RumoUI from 'rumo-ui'
import './rumo-variables.scss'

Vue.use(RumoUI)
```

:::tip
- You must override `$--font-path` so it points to Rumo UI's icon fonts.
- The theme source uses `@use 'sass:math'`, so compile it with Dart Sass (the `sass` npm package); node-sass is not supported.
:::

See `packages/theme-chalk/src/common/var.scss` for every variable you can override, for example:

```scss
$--color-primary: $--token-color-primary !default;
$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;
$--color-success: $--token-color-success !default;
$--color-warning: $--token-color-warning !default;
$--color-danger: $--token-color-danger !default;
$--color-info: $--token-color-info !default;
```

### Method 2: edit the Design Tokens and rebuild

For working inside this repository, or when you want a new compiled stylesheet.

1. Edit `tokens/tokens.json`, for example `color.primary.hex`.
2. In the repository root, run:

```shell
npm run build:theme   # generates tokens.scss and compiles the styles into lib/theme-chalk
```

3. Import `lib/theme-chalk/index.css` as with the default theme, or `lib/theme-chalk/<component>.css` per component.

:::tip
Generated files such as `tokens.scss` say "Do not edit directly" in their header. Do not edit them by hand; change `tokens/tokens.json` and regenerate.
:::
