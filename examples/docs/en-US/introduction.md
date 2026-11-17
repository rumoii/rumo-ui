# Introduction

Rumo UI is a Vue 2 component library for admin and back-office products.

## Principles
```html
<rumo-row :gutter="20">
  <rumo-col :xs="24" :sm="12" :md="12" :lg="6">
    <rumo-card class="box-card">
      <div slot="header" class="clearfix">
        <span>一致性 Consistency</span>
      </div>
      <div class="text item">
        <p><strong>与现实生活一致：</strong>与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</p>
        <p><strong>在界面中一致：</strong>所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</p>
      </div>
    </rumo-card>
  </rumo-col>
  <rumo-col :xs="24" :sm="12" :md="12" :lg="6">
    <rumo-card class="box-card">
      <div slot="header" class="clearfix">
        <span>反馈 Feedback</span>
      </div>
      <div class="text item">
        <p><strong>控制反馈：</strong>通过界面样式和交互动效让用户可以清晰的感知自己的操作；</p>
        <p><strong>页面反馈：</strong>操作后，通过页面元素的变化清晰地展现当前状态。</p>
      </div>
    </rumo-card>
  </rumo-col>
  <rumo-col :xs="24" :sm="12" :md="12" :lg="6">
    <rumo-card class="box-card">
      <div slot="header" class="clearfix">
        <span>效率 Efficiency</span>
      </div>
      <div class="text item">
        <p><strong>简化流程：</strong>设计简洁直观的操作流程；</p>
        <p><strong>清晰明确：</strong>语言表达清晰且表意明确，让用户快速理解进而作出决策；</p>
        <p><strong>帮助用户识别：</strong>界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</p>
      </div>
    </rumo-card>
  </rumo-col>
  <rumo-col :xs="24" :sm="12" :md="12" :lg="6">
    <rumo-card class="box-card">
      <div slot="header" class="clearfix">
        <span>可控 Controllability</span>
      </div>
      <div class="text item">
        <p><strong>用户决策：</strong>根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</p>
        <p><strong>结果可控：</strong>用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</p>
      </div>
    </rumo-card>
  </rumo-col>
</rumo-row>
```

## Positioning

Rumo UI combines components and assets from open source projects such as Element UI, Element Plus, splitpanes, and Tabler Icons, and adds its own dashboard (Dash), terminal, and command palette components. It is meant for developers and AI coding assistants to **reference and reuse**: import the whole library, or copy a single component's source and styles into your own project. See `NOTICE` and `licenses/` in the repository root for the origin and license of each part.

## Environment

* Vue 2.6. Vue 3 is not supported.
* Modern browsers: Chrome, Firefox, Edge, Safari.
* Developing and building this repository requires Node.js 20 (see `.nvmrc`).

## Version

The version is the one in the repository's `package.json`; see the changelog for what changed in each release.

## Installation

Rumo UI is not published to npm. See the next section, Installation, for how to get and use it.
