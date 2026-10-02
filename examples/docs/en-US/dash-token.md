[toc]

## Dash Skin Tokens

The dash skin layer targets data-dashboard scenarios with a set of runtime CSS custom properties plus matching SCSS variables. It is isolated from the global theme: every variable lives under the `.rumo-dash` scope, and dark mode is applied by `.rumo-dash.is-dark`, so existing components are unaffected.

### Accent

The accent is anchored on brand purple `#856AF9`; steps 50–950 form a lightness-monotonic ramp.
:::demo
```html
<div class="rumo-dash" style="display: flex; flex-wrap: wrap; gap: 8px;">
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-50);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-100);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-200);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-300);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-400);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-600);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-700);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-800);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-900);"></div>
  <div style="width: 56px; height: 40px; border-radius: 6px; background: var(--rumo-c-accent-950);"></div>
</div>
```
:::

### Neutrals & Semantic

Neutrals carry a slight purple hue for cohesion with the accent. Semantic colors are `success` / `warning` / `danger` / `info`; `series-1` through `series-8` form the generic categorical palette that chart components cycle through by default and callers may override.
:::demo
```html
<div class="rumo-dash" style="display: flex; flex-wrap: wrap; gap: 8px;">
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-50); border: 1px solid var(--rumo-c-neutral-200);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-200);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-400);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-600);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-neutral-800);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-success);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-warning);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-danger);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-info);"></div>
</div>
<div class="rumo-dash" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;">
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-1);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-2);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-3);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-4);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-5);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-6);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-7);"></div>
  <div style="width: 40px; height: 40px; border-radius: 6px; background: var(--rumo-c-series-8);"></div>
</div>
```
:::

### Panel, Radius & Shadow

`.rumo-panel` is the main dashboard container style (never nest it); `.rumo-num` enables tabular numerals.
:::demo
```html
<div class="rumo-dash" style="display: flex; gap: 16px; align-items: flex-start;">
  <div class="rumo-panel" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">Total calls</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight);">128,450</div>
  </div>
  <div class="rumo-panel rumo-panel--strong" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">Week over week</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight); color: var(--rumo-c-success);">+12.4%</div>
  </div>
</div>
```
:::

### Dark Mode

Add the `is-dark` class on the skin container to switch the token set; components need no change.
:::demo
```html
<div class="rumo-dash is-dark" style="display: flex; gap: 16px; align-items: flex-start; background: var(--rumo-c-paper); padding: 16px; border-radius: var(--rumo-radius-lg);">
  <div class="rumo-panel" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">Total calls</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight);">128,450</div>
  </div>
  <div class="rumo-panel rumo-panel--strong" style="width: 200px;">
    <div style="font-size: var(--rumo-text-caption-size); color: var(--rumo-c-neutral-500);">Week over week</div>
    <div class="rumo-num" style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight); color: var(--rumo-c-success);">+12.4%</div>
  </div>
</div>
```
:::

### Type Scale

The scale covers display-level numbers down to label text; pair numeric columns with `.rumo-num`.
:::demo
```html
<div class="rumo-dash">
  <div style="font-size: var(--rumo-text-display-sm-size); line-height: var(--rumo-text-display-sm-lh); font-weight: var(--rumo-text-display-sm-weight); letter-spacing: var(--rumo-text-display-sm-ls);">Display 56</div>
  <div style="font-size: var(--rumo-text-hero-size); line-height: var(--rumo-text-hero-lh); font-weight: var(--rumo-text-hero-weight); letter-spacing: var(--rumo-text-hero-ls);">Hero 48</div>
  <div style="font-size: var(--rumo-text-h1-size); line-height: var(--rumo-text-h1-lh); font-weight: var(--rumo-text-h1-weight);">H1 36</div>
  <div style="font-size: var(--rumo-text-h2-size); line-height: var(--rumo-text-h2-lh); font-weight: var(--rumo-text-h2-weight);">H2 28</div>
  <div style="font-size: var(--rumo-text-h3-size); line-height: var(--rumo-text-h3-lh); font-weight: var(--rumo-text-h3-weight);">H3 22</div>
  <div style="font-size: var(--rumo-text-body-size); line-height: var(--rumo-text-body-lh);">Body 16 regular text</div>
  <div style="font-size: var(--rumo-text-body-sm-size); line-height: var(--rumo-text-body-sm-lh);">Body-sm 14 secondary text</div>
  <div style="font-size: var(--rumo-text-caption-size); line-height: var(--rumo-text-caption-lh); font-weight: var(--rumo-text-caption-weight); color: var(--rumo-c-neutral-500);">Caption 12 helper text</div>
  <div style="font-size: var(--rumo-text-label-size); line-height: var(--rumo-text-label-lh); font-weight: var(--rumo-text-label-weight); letter-spacing: var(--rumo-text-label-ls); color: var(--rumo-c-neutral-500);">LABEL 11 label</div>
</div>
```
:::

### Token Reference

| Token | Description |
| --- | --- |
| `--rumo-c-ink` / `--rumo-c-paper` | Foreground / background base colors; swap automatically in dark mode |
| `--rumo-c-neutral-50` … `950` | 11-step neutrals with a slight purple hue |
| `--rumo-c-accent` with `-dark` / `-light` / `50` … `950` | Accent family, main value `#856AF9` |
| `--rumo-c-amber` with `-dark` / `-light` | Supporting accent |
| `--rumo-c-success` / `--rumo-c-warning` / `--rumo-c-danger` / `--rumo-c-info` | Semantic colors |
| `--rumo-c-series-1` … `8` | Generic categorical palette |
| `--rumo-font-sans` / `--rumo-font-mono` | Font stacks |
| `--rumo-text-*` | Type scale (`-size` / `-lh` / `-weight` / `-ls`) |
| `--rumo-radius-*` | Radius `sm` / `md` / `lg` / `xl` / `full` |
| `--rumo-shadow-*` | Shadow `sm` / `base` / `md` / `lg` |
| `--rumo-space-*` | Spacing scale 0–20 |
| `--rumo-motion-*` | Motion durations `fast` / `base` / `slow` and easing `ease` |
| `--rumo-bp-tall` / `--rumo-bp-xtall` | Vertical breakpoints (min-height 900px / 1000px) |

### Usage Rules

- CSS variables only apply inside a `.rumo-dash` container; dashboard components are wrapped in `class="rumo-dash"` in the docs demos.
- Component styles reference the SCSS variables `$--dash-*` at compile time (same names, from `common/tokens-dash.scss`); runtime theming uses `--rumo-*`.
- Dark mode is driven by the container class `.rumo-dash.is-dark`, never by a global `:root` override.
- Older engines (Chromium < 111) fall back to sRGB hex automatically; engines with OKLCH support get perceptually uniform values inside the `@supports` gate.
