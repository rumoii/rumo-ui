## 常见问题

<details>
  <summary>给组件绑定的事件为什么无法触发？</summary>
  
  在 Vue 2.0 中，为**自定义**组件绑定**原生**事件必须使用 `.native` 修饰符：
  ```html
  <my-component @click.native="handleClick">Click Me</my-component>
  ```
  
  从易用性的角度出发，我们对 `Button` 组件进行了处理，使它可以监听 `click` 事件：
  ```html
  <rumo-button @click="handleButtonClick">Click Me</rumo-button>
  ```
  
  但是对于其他组件，还是需要添加 `.native` 修饰符。
</details>

<details>
  <summary>如何在 Table 组件的每一行添加操作该行数据的按钮？</summary>
  
  使用 [Scoped slot](https://vuejs.org/v2/guide/components.html#Scoped-Slots) 即可：
  ```html
  <rumo-table-column label="操作">
    <template slot-scope="props">
      <rumo-button @click.native="showDetail(props.row)">查看详情</rumo-button>
    </template>
  </rumo-table-column>
  ```
  参数 `row` 即为对应行的数据。
</details>

<details>
  <summary>Tree 组件的 `render-content` 和 Table 组件的 `render-header` 怎么用？</summary>
  
  请阅读 Vue 文档 [Render Function](http://vuejs.org/v2/guide/render-function.html) 的相关内容。注意，使用 JSX 来写 Render Function 的话，需要安装 `babel-plugin-transform-vue-jsx`，并参照其[文档](https://github.com/vuejs/babel-plugin-transform-vue-jsx)进行配置。
</details>

<details>
  <summary>所有组件的任意属性都支持 `.sync` 修饰符吗？</summary>
  
  不是。对于支持 `.sync` 修饰符的属性，我们会在文档的 API 表格中注明。更多 `.sync` 的用法请查看 [Vue 文档](https://vuejs.org/v2/guide/components.html#sync-Modifier)。
</details>

<details>
  <summary>你们的文档怎么偷偷更新了？</summary>
  
  我们只会在 RumoUI 发布新版本时同步更新文档，以体现最新的变化。详细的更新内容可以查看 [changelog](./CHANGELOG.zh-CN.md)。
</details>

<details>
  <summary>将 RumoUI 克隆至本地，运行时为何会报错/跑不起来？</summary>
  
  首先，确保克隆的是 master 分支的最新代码，并且文件完整。其次，确保本地的 node 版本在 4.0 以上，npm 版本在 3.0 以上。最后，可以启动开发环境：
  
  ```bash
  npm run dev
  ```
  
  或是直接打包：
  
  ```bash
  npm run dist
  ```
</details>

## FAQ

<details>
  <summary>Why are my event listeners not working?</summary>
  
  In Vue 2.0, adding **native** event handlers in **custom** components requires a `.native` modifier:
  ```html
  <my-component @click.native="handleClick">Click Me</my-component>
  ```
  
  For the sake of usability, we processed `Button` so it can listen to `click` events:
  ```html
  <rumo-button @click="handleButtonClick">Click Me</rumo-button>
  ```
  
  For other components, the `.native` modifier is still mandatory.
</details>

<details>
  <summary>How do I add buttons in each row of Table to operate data of that row?</summary>
  
  Just use [Scoped slot](https://vuejs.org/v2/guide/components.html#Scoped-Slots):
  ```html
  <rumo-table-column label="Operations">
    <template slot-scope="props">
      <rumo-button @click.native="showDetail(props.row)">Details</rumo-button>
    </template>
  </rumo-table-column>
  ```
  The parameter `row` is the data object of corresponding row.
</details>

<details>
  <summary>How do `render-content` of Tree and `render-header` of Table work?</summary>
  
  Please refer to [Render Function](http://vuejs.org/v2/guide/render-function.html) in Vue's documentation. In addition, if you are writing render functions with JSX, `babel-plugin-transform-vue-jsx` is required. See [here](https://github.com/vuejs/babel-plugin-transform-vue-jsx) for its configurations.
</details>

<details>
  <summary>Can I use `.sync` modifier on every attribute?</summary>
  
  No, only a few attributes supports the `.sync` modifier, and we have explicitly marked them on the documentation's API table. For more information about `.sync`, please refer to [Vue documentation](https://vuejs.org/v2/guide/components.html#sync-Modifier).
</details>

<details>
  <summary>When do you update documentations of RumoUI?</summary>
  
  We update documentations only when a new version of RumoUI is published so that it reflects all the changes introduced in that version. Updated changed can be found in the [changelog](./CHANGELOG.en-US.md)。
</details>

<details>
  <summary>I cloned RumoUI's repo, but failed to run it. How do I solve it?</summary>
  
  First, please make sure to clone the latest code in master branch and cloned files are intact. Then, note that the version of Nodejs should be 4.0+ and npm 3.0+. Finally, activate development:
  
  ```bash
  npm run dev
  ```
  
  or build it:
  
  ```bash
  npm run dist
  ```
</details>

## Preguntas más frecuentes

<details>
  <summary>¿Porque mis receptores de eventos no funcionan?</summary>
  
  En Vue 2.0, agregando **nativos** receptores de evento **a medida** componentes requiere el modificador `.native`:
  ```
  html
  <mi-componente @click.native="handleClick">Haga Clic Aquí</mi-componente>
  ```
  
  Para conveniencia, hemos ya procesado eventos para el componente `Button` para que el interfaz sea consistente con `clic` eventos de otros componentes:
  
  ```html
  <rumo-button @click="handleButtonClick">Haga Clic Aquí</rumo-button>
  ```
  
  Para otros componentes el uso del modificador `.native` sigue siendo obligatorio.
</details>

<details>
  <summary>¿Como agrego botones en cada linea de una tabla para que operen en los datos de esa linea?</summary>
  
  Simplemente agregue [“Scoped slot”](https://vuejs.org/v2/guide/components.html#Scoped-Slots):
  ```html
  <rumo-table-column label="Operaciones">
    <template slot-scope="props">
      <rumo-button @click.native="verDetalles(props.row)">Detalles</rumo-button>
    </template>
  </rumo-table-column>
  ```
  El parámetro `row` contiene los datos de la linea correspondiente de la tabla.
</details>

<details>
  <summary>¿Como funcionan `render-content` de `Tree` y `render-header` de `Table`?</summary>
  
  Por favor refiérase a [Función de representación](http://vuejs.org/v2/guide/render-function.html) en la documentación de `Vue`. Adicionalmente, sí usted está escribiendo funciones de representar con JSX, se requiere el componente `babel-plugin-transform-vue-jsx`. Más información [aquí](https://github.com/vuejs/babel-plugin-transform-vue-jsx) para su uso y configuración.
</details>

<details>
  <summary>¿Puedo usar el modificador `.sync` con cada atributo?</summary>
  
  No, solamente un grupo pequeño de atributos apoyan el modificador `.sync`, y están anotados claramente en la documentación del IPA. Para información adicional sobre `.sync`, por favor refiérase a [documentación de Vue](https://vuejs.org/v2/guide/components.html#sync-Modifier).
</details>

<details>
  <summary>¿Cuando añaden a la documentación de `RumoUI`?</summary>
  
  Añadamos la documentación con cada versión nueva de `RumoUI` y los cambios reflejan los cambios del software de esa versión. Los cambios actuales y históricos se encuentran [aquí](./CHANGELOG.en-US.md).
</details>

<details>
  <summary>Hice un clon del repositorio de `RumoUI` pero no arranca. ¿Como lo resuelvo?</summary>
  
  Primero, pro favor, asegúrese de usar la versión más corriente en la rama  `master` y que los archivos están en orden. Después, revise sí la versión de `Nodejs` es 4.0+ y `npm` debe ser 3.0+. Finalmente active el modo desarrollo:
  
  ```bash
  npm run dev
  ```
  
  O arme su aplicación así:
  
  ```bash
  npm run dist
  ```
</details>
