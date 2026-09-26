<template>
  <transition :name="disableTransitions ? '' : 'rumo-zoom-in-center'">
    <span class="rumo-tag"
      @click="showInput"
      :class="[
          type ? 'rumo-tag--' + type : '',
          tagSize && `rumo-tag--${tagSize}`,
          {'is-hit': hit},
          effect ? `rumo-tag--${effect}` : ''
        ]"
      :style="{backgroundColor: color, cursor: editable ? 'text': 'default'}">
      <span v-if="editable"
        v-text="textValue"></span>
      <slot v-else></slot>
      <input :class="[
            type ? 'rumo-tag--' + type : '',
            tagSize && `rumo-tag-new--${tagSize}`,
            tagSize && `rumo-tag--${tagSize}`
          ]"
        class="rumo-tag-new rumo-tag input__inner"
        v-if="inputVisible"
        v-model="textValue"
        ref="saveTagInput"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm" />
      <template v-if="closable">
        <slot v-if="$slots.close" name="close"></slot>
        <i class="rumo-tag__close rumo-icons icon-close"
          v-else
          @click.stop="handleClose"></i>
      </template>
    </span>
  </transition>
</template>
<script>
export default {
  name: 'RumoTag',
  data() {
    return {
      inputVisible: false,
      oldValue: this.text,
      textValue: this.text
    };
  },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    text: String,
    id: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String,
    effect: {
      type: String,
      default: 'light',
      validator(val) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1;
      }
    }
  },
  methods: {
    showInput() {
      if (this.editable) {
        this.inputVisible = true;
        this.oldValue = this.textValue;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.focus();
          this.$emit('focus', this.textValue);
        });
      }
    },
    handleInputConfirm() {
      let n = this.textValue;
      const args = Object.assign({}, this.$props, { oldValue: this.oldValue, newValue: n });
      if (n !== this.oldValue && n !== '') {
        this.$emit('edit', args);
      } else if (n === '') {
        this.textValue = this.oldValue;
      }
      this.inputVisible = false;
    },
    handleClose(event) {
      this.$emit('close', event);
    }
  },
  computed: {
    tagSize() {
      return this.size || (this.$RUMO || {}).size;
    }
  }
};
</script>
