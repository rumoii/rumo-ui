# 介绍

Rumo UI 是沉淀出的基础组件库，基于 Vue 实现，开发和服务于企业级后台产品。

## 特性
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

## 支持环境

* 现代浏览器和 IE9 及以上（需要 polyfills）。
* 支持服务端渲染。

## 版本

稳定版：V1.0.0
预览版：V1.0.0

## 安装

```bash
$ xnpm i -S rumo-ui
```

**我们推荐使用 [rumo-cli](../component/rumo-cli) 集成的 `xnpm` 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。
