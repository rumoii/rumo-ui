<template>
  <div :class="[
    type === 'textarea' ? 'rumo-textarea' : 'rumo-input',
    inputSize ? 'rumo-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'rumo-input-group': $slots.prepend || $slots.append,
      'rumo-input-group--append': $slots.append,
      'rumo-input-group--prepend': $slots.prepend,
      'rumo-input--prefix': $slots.prefix || prefixIcon,
      'rumo-input--suffix': $slots.suffix || suffixIcon || clearable
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="rumo-input-group__prepend"
        v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input 
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="rumo-input__inner"
        v-bind="$attrs"
        :value="currentValue"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label">
      <!-- 前置内容 -->
      <span class="rumo-input__prefix"
        v-if="$slots.prefix || prefixIcon"
        :style="prefixOffset">
        <slot name="prefix"></slot>
        <i class="rumo-input__icon"
          v-if="prefixIcon"
          :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span class="rumo-input__suffix"
        v-if="getSuffixVisible()"
        :style="suffixOffset">
        <span class="rumo-input__suffix-inner">
          <i v-if="showClear"
            class="rumo-input__icon rumo-icons icon-close-fill rumo-input__clear"
            @click="clear">
          </i>
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="rumo-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-if="showPwdVisible"
            class="rumo-input__icon rumo-icons rumo-input__visible"
            :class="passwordVisible ? 'icon-visible' : 'icon-invisible'"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="rumo-input__count">
            <span class="rumo-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <i class="rumo-input__icon"
          v-if="validateState"
          :class="['rumo-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="rumo-input-group__append"
        v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea v-else
      :tabindex="tabindex"
      :value="currentValue"
      class="rumo-textarea__inner"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      :rows="rows"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label">
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="rumo-input__count">{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script>
import emitter from 'rumo-ui/src/mixins/emitter';
import Migrating from 'rumo-ui/src/mixins/migrating';
import calcTextareaHeight from './calcTextareaHeight';
import merge from 'rumo-ui/src/utils/merge';
import { isKorean } from 'rumo-ui/src/utils/shared';

export default {
  name: 'RumoInput',

  componentName: 'RumoInput',

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    rumoForm: {
      default: ''
    },
    rumoFormItem: {
      default: ''
    }
  },

  data() {
    return {
      currentValue: this.value === undefined || this.value === null
        ? ''
        : this.value,
      textareaCalcStyle: {},
      prefixOffset: null,
      suffixOffset: null,
      hovering: false,
      focused: false,
      isOnComposition: false,
      passwordVisible: false
    };
  },

  props: {
    value: [String, Number],
    rows: {
      type: Number,
      default: 3
    },
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
        return true;
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },

  computed: {
    _rumoFormItemSize() {
      return (this.rumoFormItem || {}).rumoFormItemSize;
    },
    validateState() {
      return this.rumoFormItem ? this.rumoFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.rumoForm ? this.rumoForm.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: 'rumo-icon-loading',
        success: 'rumo-icon-circle-check',
        error: 'rumo-icon-close-fill'
      }[this.validateState];
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    inputSize() {
      return this.size || this._rumoFormItemSize || (this.$RUMO || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.rumoForm || {}).disabled;
    },
    isGroup() {
      return this.$slots.prepend || this.$slots.append;
    },
    showClear() {
      return this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.currentValue !== '' &&
        (this.focused || this.hovering);
    },
    showPwdVisible() {
      return this.showPassword &&
        !this.inputDisabled &&
        !this.readonly &&
        (!!this.currentValue || this.focused);
    },
    isWordLimitVisible() {
      return this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword;
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.currentValue === 'number') {
        return String(this.currentValue).length;
      }

      return (this.currentValue || '').length;
    },
    inputExceed() {
      return this.isWordLimitVisible &&
        (this.textLength > this.upperLimit);
    }
  },

  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val);
    }
  },

  methods: {
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    getMigratingConfig() {
      return {
        props: {
          'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          'click': 'click is removed.'
        }
      };
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('RumoFormItem', 'rumo.form.blur', [this.currentValue]);
      }
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      var { autosize, type } = this;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleComposition(event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.handleInput(event);
      } else {
        const text = event.target.value;
        const lastCharacter = text[text.length - 1] || '';
        this.isOnComposition = !isKorean(lastCharacter);
      }
    },
    handleInput(event) {
      if (this.isOnComposition) return;
      const value = event.target.value;
      this.$emit('input', value);
      this.$nextTick(this.setCurrentValue(value))
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.$nextTick(_ => {
        this.resizeTextarea();
      });
      this.currentValue = value;
      if (this.validateEvent) {
        this.dispatch('RumoFormItem', 'rumo.form.change', [value]);
      }
    },
    calcIconOffset(place) {
      const pendantMap = {
        'suf': 'append',
        'pre': 'prepend'
      };

      const pendant = pendantMap[place];

      if (this.$slots[pendant]) {
        return { transform: `translateX(${place === 'suf' ? '-' : ''}${this.$el.querySelector(`.rumo-input-group__${pendant}`).offsetWidth}px)` };
      }
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
      this.setCurrentValue('');
      this.focus();
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.focus();
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    getSuffixVisible() {
      return this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon);
    }
  },

  created() {
    this.$on('inputSelect', this.select);
  },

  mounted() {
    this.resizeTextarea();
    if (this.isGroup) {
      this.prefixOffset = this.calcIconOffset('pre');
      this.suffixOffset = this.calcIconOffset('suf');
    }
  }
};
</script>
