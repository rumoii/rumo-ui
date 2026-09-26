[toc]

## Form 表单

由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据

### 典型表单

包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。

:::demo在 Form 组件中，每一个表单域由一个 Form-Item 组件构成，表单域中可以放置各种类型的表单控件，包括 Input、Select、Checkbox、Radio、Switch、DatePicker、TimePicker
```html

<div style="margin-bottom: 5px;">
  &nbsp;&nbsp;尺寸:
  <rumo-radio-group v-model="demoForm.size" size="mini">
    <rumo-radio-button label="large">大型</rumo-radio-button>
    <rumo-radio-button label="medium">中型</rumo-radio-button>
    <rumo-radio-button label="">默认</rumo-radio-button>
    <rumo-radio-button label="small">小型</rumo-radio-button>
    <rumo-radio-button label="mini">迷你</rumo-radio-button>
  </rumo-radio-group>
  &nbsp;&nbsp;对齐方式:
  <rumo-radio-group v-model="demoForm.labelPosition" size="mini">
    <rumo-radio-button label="left">左对齐</rumo-radio-button>
    <rumo-radio-button label="right">右对齐</rumo-radio-button>
    <rumo-radio-button label="top">顶部对齐</rumo-radio-button>
    <!-- <rumo-radio-button label="inline">行内</rumo-radio-button> -->
  </rumo-radio-group>
</div>
<div style="margin-bottom: 5px;">
  &nbsp;全局禁止:
  <rumo-radio-group v-model="demoForm.disabled" size="mini">
    <rumo-radio-button :label="true">true</rumo-radio-button>
    <rumo-radio-button :label="false">false</rumo-radio-button>
  </rumo-radio-group>
  &nbsp;&nbsp;选择项统计显示:
  <rumo-radio-group v-model="demoForm.collapseTags" size="mini">
    <rumo-radio-button :label="true">true</rumo-radio-button>
    <rumo-radio-button :label="false">false</rumo-radio-button>
  </rumo-radio-group>
</div>

<rumo-form :model="demoForm" :rules="rules" ref="demoForm" label-width="100px" class="demo-ruleForm" :size="demoForm.size" :label-position="demoForm.labelPosition" :inline="demoForm.inline" :disabled="demoForm.disabled">
  <rumo-form-item label="活动名称" prop="name">
    <rumo-input v-model="demoForm.name"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动区域" prop="region">
    <rumo-select v-model="demoForm.region" placeholder="请选择活动区域">
      <rumo-option label="区域一" value="shanghai"></rumo-option>
      <rumo-option label="区域二" value="beijing"></rumo-option>
    </rumo-select>
  </rumo-form-item>
  <rumo-form-item label="活动时间" required>
    <rumo-col :span="11">
      <rumo-form-item prop="date1">
        <rumo-date-picker type="date" placeholder="选择日期" v-model="demoForm.date1" style="width: 100%;"></rumo-date-picker>
      </rumo-form-item>
    </rumo-col>
    <rumo-col class="line" :span="2">-</rumo-col>
    <rumo-col :span="11">
      <rumo-form-item prop="date2">
        <rumo-time-picker type="fixed-time" placeholder="选择时间" v-model="demoForm.date2" style="width: 100%;"></rumo-time-picker>
      </rumo-form-item>
    </rumo-col>
  </rumo-form-item>
  <rumo-form-item label="活动食品" prop="food">
    <rumo-select
      v-model="demoForm.food"
      multiple
      :collapse-tags="demoForm.collapseTags"
      placeholder="请选择">
      <rumo-option
        v-for="item in foods"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </rumo-option>
    </rumo-select>
  </rumo-form-item>
  <rumo-form-item label="即时配送" prop="delivery">
    <rumo-input v-model="demoForm.name" :readonly="!demoForm.delivery">
      <rumo-switch inactive-text="关" active-text="开" v-model="demoForm.delivery" slot="prepend"></rumo-switch>
    </rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动性质" prop="type">
    <rumo-checkbox-group v-model="demoForm.type">
      <rumo-checkbox label="美食/餐厅线上活动" name="type"></rumo-checkbox>
      <rumo-checkbox label="地推活动" name="type"></rumo-checkbox>
      <rumo-checkbox label="线下主题活动" name="type"></rumo-checkbox>
      <rumo-checkbox label="单纯品牌曝光" name="type"></rumo-checkbox>
    </rumo-checkbox-group>
  </rumo-form-item>
  <rumo-form-item label="特殊资源" prop="resource">
    <rumo-radio-group v-model="demoForm.resource">
      <rumo-radio label="线上品牌商赞助"></rumo-radio>
      <rumo-radio label="线下场地免费"></rumo-radio>
    </rumo-radio-group>
  </rumo-form-item>
  <rumo-form-item label="活动形式" prop="desc" topLabel>
    <rumo-input type="textarea" v-model="demoForm.desc"></rumo-input>
  </rumo-form-item>
  <rumo-form-item>
    <rumo-button type="primary" @click="submitForm('demoForm')">立即创建</rumo-button>
    <rumo-button @click="resetForm('demoForm')">重置</rumo-button>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      return {
        demoForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          size: 'small',
          disabled: false,
          collapseTags: false,
          labelPosition: 'right',
          inline: false,
          food: []
        },
        foods: [
          {
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '台湾的蚵仔煎'
          }, {
            value: '选项4',
            label: '1234567890浙江杭州滨江的龙须面123567890'
          }, {
            value: '选项5',
            label: '北京全聚德烤鸭'
          }, {
            value: '选项6',
            label: '双皮奶'
          }, {
            value: '选项7',
            label: '我是个加长的食物名称，为了占位置的'
          }, {
            value: '选项8',
            label: '这里没有食物了'
          }, {
            value: '选项9',
            label: '12345678902356789543223456787654其他xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
          }
        ],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
```
:::

:::tip
W3C 标准中有如下[规定](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2)：
> <i>When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.</i>

即：当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 `<rumo-form>` 标签上添加 `@submit.native.prevent`。
:::

### 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。

:::demo 设置 `inline` 属性可以让表单域变为行内的表单域
```html
<rumo-form :inline="true" :model="formInline" class="demo-form-inline">
  <rumo-form-item label="审批人">
    <rumo-input v-model="formInline.user" placeholder="审批人"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动区域">
    <rumo-select v-model="formInline.region" placeholder="活动区域">
      <rumo-option label="区域一" value="shanghai"></rumo-option>
      <rumo-option label="区域二" value="beijing"></rumo-option>
    </rumo-select>
  </rumo-form-item>
  <rumo-form-item>
    <rumo-button type="primary" @click="onSubmit">查询</rumo-button>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
```
:::

### 对齐方式

根据具体目标和制约因素，选择最佳的标签对齐方式。

:::demo 通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`，当设为 `top` 时标签会置于表单域的顶部
```html
<rumo-radio-group v-model="labelPosition" size="small">
  <rumo-radio-button label="left">左对齐</rumo-radio-button>
  <rumo-radio-button label="right">右对齐</rumo-radio-button>
  <rumo-radio-button label="top">顶部对齐</rumo-radio-button>
</rumo-radio-group>
<div style="margin: 20px;"></div>
<rumo-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
  <rumo-form-item label="名称">
    <rumo-input v-model="formLabelAlign.name"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动区域">
    <rumo-input v-model="formLabelAlign.region"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动形式">
    <rumo-input v-model="formLabelAlign.type"></rumo-input>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      return {
        labelPosition: 'right',
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        }
      };
    }
  }
</script>
```
:::

### 表单验证

在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。

:::demo Form 组件提供了表单验证的功能，只需要通过 `rules` 属性传入约定的验证规则，并 Form-Item 的 `prop` 属性设置为需校验的字段名即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)
```html
<rumo-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <rumo-form-item label="活动名称" prop="name">
    <rumo-input v-model="ruleForm.name"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动区域" prop="region">
    <rumo-select v-model="ruleForm.region" placeholder="请选择活动区域">
      <rumo-option label="区域一" value="shanghai"></rumo-option>
      <rumo-option label="区域二" value="beijing"></rumo-option>
    </rumo-select>
  </rumo-form-item>
  <rumo-form-item label="活动时间" required>
    <rumo-col :span="11">
      <rumo-form-item prop="date1">
        <rumo-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></rumo-date-picker>
      </rumo-form-item>
    </rumo-col>
    <rumo-col class="line" :span="2">-</rumo-col>
    <rumo-col :span="11">
      <rumo-form-item prop="date2">
        <rumo-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></rumo-time-picker>
      </rumo-form-item>
    </rumo-col>
  </rumo-form-item>
  <rumo-form-item label="即时配送" prop="delivery">
    <rumo-switch v-model="ruleForm.delivery"></rumo-switch>
  </rumo-form-item>
  <rumo-form-item label="活动性质" prop="type">
    <rumo-checkbox-group v-model="ruleForm.type">
      <rumo-checkbox label="美食/餐厅线上活动" name="type"></rumo-checkbox>
      <rumo-checkbox label="地推活动" name="type"></rumo-checkbox>
      <rumo-checkbox label="线下主题活动" name="type"></rumo-checkbox>
      <rumo-checkbox label="单纯品牌曝光" name="type"></rumo-checkbox>
    </rumo-checkbox-group>
  </rumo-form-item>
  <rumo-form-item label="特殊资源" prop="resource">
    <rumo-radio-group v-model="ruleForm.resource">
      <rumo-radio label="线上品牌商赞助"></rumo-radio>
      <rumo-radio label="线下场地免费"></rumo-radio>
    </rumo-radio-group>
  </rumo-form-item>
  <rumo-form-item label="活动形式" prop="desc">
    <rumo-input type="textarea" v-model="ruleForm.desc"></rumo-input>
  </rumo-form-item>
  <rumo-form-item>
    <rumo-button type="primary" @click="submitForm('ruleForm')">立即创建</rumo-button>
    <rumo-button @click="resetForm('ruleForm')">重置</rumo-button>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
```
:::

### 自定义校验规则

这个例子中展示了如何使用自定义验证规则来完成密码的二次验证。

:::demo 本例还使用`status-icon`属性为输入框添加了表示校验结果的反馈图标。
```html
<rumo-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
  <rumo-form-item label="密码" prop="pass">
    <rumo-input type="password" v-model="ruleForm2.pass" auto-complete="off"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="确认密码" prop="checkPass">
    <rumo-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="年龄" prop="age">
    <rumo-input v-model.number="ruleForm2.age"></rumo-input>
  </rumo-form-item>
  <rumo-form-item>
    <rumo-button type="primary" @click="submitForm('ruleForm2')">提交</rumo-button>
    <rumo-button @click="resetForm('ruleForm2')">重置</rumo-button>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
```
:::

### 动态增减表单项

:::demo 除了在 Form 组件上一次性传递所有的验证规则外还可以在单个的表单域上传递属性的验证规则
```html
<rumo-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
  <rumo-form-item
    prop="email"
    label="邮箱"
    :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"
  >
    <rumo-input v-model="dynamicValidateForm.email"></rumo-input>
  </rumo-form-item>
  <rumo-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :label="'域名' + index"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
    :rules="{
      required: true, message: '域名不能为空', trigger: 'blur'
    }"
  >
    <rumo-input v-model="domain.value"></rumo-input><rumo-button @click.prevent="removeDomain(domain)">删除</rumo-button>
  </rumo-form-item>
  <rumo-form-item>
    <rumo-button type="primary" @click="submitForm('dynamicValidateForm')">提交</rumo-button>
    <rumo-button @click="addDomain">新增域名</rumo-button>
    <rumo-button @click="resetForm('dynamicValidateForm')">重置</rumo-button>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      return {
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }
    }
  }
</script>
```
:::

### 数字类型验证

:::demo 数字类型的验证需要在 `v-model` 处加上 `.number` 的修饰符，这是 `Vue` 自身提供的用于将绑定值转化为 `number` 类型的修饰符。
```html
<rumo-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
  <rumo-form-item
    label="年龄"
    prop="age"
    :rules="[
      { required: true, message: '年龄不能为空'},
      { type: 'number', message: '年龄必须为数字值'}
    ]">
    <rumo-input type="number" v-model.number="numberValidateForm.age" auto-complete="off"></rumo-input>
  </rumo-form-item>
  <rumo-form-item>
    <rumo-button type="primary" @click="submitForm('numberValidateForm')">提交</rumo-button>
    <rumo-button @click="resetForm('numberValidateForm')">重置</rumo-button>
  </rumo-form-item>
</rumo-form>
<script>
  export default {
    data() {
      return {
        numberValidateForm: {
          age: ''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
```
:::

:::tip
嵌套在 `rumo-form-item` 中的 `rumo-form-item` 标签宽度默认为零，不会继承 `rumo-form` 的 `label-width`。如果需要可以为其单独设置 `label-width` 属性。
:::

### 表单内组件尺寸控制

通过设置 Form 上的 `size` 属性可以使该表单内所有可调节大小的组件继承该尺寸。Form-Item 也具有该属性。

:::demo 如果希望某个表单项或某个表单组件的尺寸不同于 Form 上的`size`属性，直接为这个表单项或表单组件设置自己的`size`即可。

```html
<rumo-form ref="form" :model="sizeForm" label-width="80px" size="small">
  <rumo-form-item label="活动名称">
    <rumo-input v-model="sizeForm.name"></rumo-input>
  </rumo-form-item>
  <rumo-form-item label="活动区域">
    <rumo-select v-model="sizeForm.region" placeholder="请选择活动区域">
      <rumo-option label="区域一" value="shanghai"></rumo-option>
      <rumo-option label="区域二" value="beijing"></rumo-option>
    </rumo-select>
  </rumo-form-item>
  <rumo-form-item label="活动时间">
    <rumo-col :span="11">
      <rumo-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" style="width: 100%;"></rumo-date-picker>
    </rumo-col>
    <rumo-col class="line" :span="2">-</rumo-col>
    <rumo-col :span="11">
      <rumo-time-picker type="fixed-time" placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></rumo-time-picker>
    </rumo-col>
  </rumo-form-item>
  <rumo-form-item label="活动性质">
    <rumo-checkbox-group v-model="sizeForm.type">
      <rumo-checkbox-button label="美食/餐厅线上活动" name="type"></rumo-checkbox-button>
      <rumo-checkbox-button label="地推活动" name="type"></rumo-checkbox-button>
      <rumo-checkbox-button label="线下主题活动" name="type"></rumo-checkbox-button>
    </rumo-checkbox-group>
  </rumo-form-item>
  <rumo-form-item label="特殊资源">
    <rumo-radio-group v-model="sizeForm.resource" size="medium">
      <rumo-radio border label="线上品牌商赞助"></rumo-radio>
      <rumo-radio border label="线下场地免费"></rumo-radio>
    </rumo-radio-group>
  </rumo-form-item>
  <rumo-form-item size="large">
    <rumo-button type="primary" @click="onSubmit">立即创建</rumo-button>
    <rumo-button>取消</rumo-button>
  </rumo-form-item>
</rumo-form>

<script>
  export default {
    data() {
      return {
        sizeForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      };
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  };
</script>
```
:::

### Form Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| model   | 表单数据对象 | object      |                  —                |  — |
| rules    | 表单验证规则 | object | — | — |
| inline    | 行内表单模式 | boolean | — | false |
| label-position | 表单域标签的位置 | string |  right/left/top            | right |
| label-width | 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值 | string | — | — |
| hide-required-asterisk | 是否隐藏必填字段的标签旁边的红色星号 | boolean | — | false |
| label-suffix | 表单域标签的后缀 | string | — | — |
| show-message  | 是否显示校验错误信息 | boolean | — | true |
| inline-message  | 是否以行内形式展示校验信息 | boolean | — | false |
| status-icon  | 是否在输入框中显示校验结果反馈图标 | boolean | — | false |
| validate-on-rule-change  | 是否在 `rules` 属性改变后立即触发一次验证 | boolean | — | true |
| size  | 用于控制该表单内组件的尺寸 | string | large / medium / small / mini | - |
| disabled | 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效 | boolean | — | false |

### Form Methods

| 方法名      | 说明          | 参数
|---------- |-------------- | --------------
| validate | 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise | Function(callback: Function(boolean, object))
| validateField | 对部分表单字段进行校验的方法 | Function(prop: string, callback: Function(errorMessage: string))
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | -
| clearValidate | 移除整个表单的校验结果 | -

### Form Events
| 事件名称 | 说明    | 回调参数  |
|--------- |-------- |---------- |
| validate | 任一表单项被校验后触发 | 被校验的表单项 prop 值，校验是否通过 |

### Form-Item Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| prop    | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | string    | 传入 Form 组件的 `model` 中的字段 | — |
| label | 标签文本 | string | — | — |
| label-width | 表单域标签的的宽度，例如 '50px' | string |       —       | — |
| required | 是否必填，如不设置，则会根据校验规则自动生成 | boolean | — | false |
| rules    | 表单验证规则 | object | — | — |
| error    | 表单域验证错误信息, 设置该值会使表单验证状态变为`error`，并显示该错误信息 | string | — | — |
| show-message  | 是否显示校验错误信息 | boolean | — | true |
| inline-message  | 以行内形式展示校验信息 | boolean | — | false |
| size  | 用于控制该表单域下组件的尺寸 | string | large / medium / small / mini | - |

### Form-Item Slot
| name | 说明 |
|------|--------|
| — | Form Item 的内容 |
| label | 标签文本的内容 |

### Form-Item Scoped Slot
|  name  |   说明  |
|--------|--------|
|  error | 自定义表单校验信息的显示方式，参数为 { error } |

### Form-Item Methods

| 方法名      | 说明          | 参数
|---------- |-------------- | --------------
| resetField | 对该表单项进行重置，将其值重置为初始值并移除校验结果 | -
| clearValidate | 移除该表单项的校验结果 | -
