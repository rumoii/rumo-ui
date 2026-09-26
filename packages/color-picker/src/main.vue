<template>
  <div :class="[
      'rumo-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `rumo-color-picker--${ colorSize }` : ''
    ]"
    v-clickoutside="hide">
    <div class="rumo-color-picker__mask"
      v-if="colorDisabled"></div>
    <div class="rumo-color-picker__trigger"
      @click="handleTrigger">
      <span class="rumo-color-picker__color"
        :class="{ 'is-alpha': showAlpha }">
        <span class="rumo-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"></span>
        <span class="rumo-color-picker__empty rumo-icons icon-close"
          v-if="!value && !showPanelColor"></span>
      </span>
      <span class="rumo-color-picker__value" :class="{ 'is-alpha': showAlpha }">{{ value }}</span>
      <span class="rumo-color-picker__icon rumo-icons icon-down-line"
        v-show="value || showPanelColor"></span>
    </div>
    <picker-dropdown ref="dropdown"
      :class="['rumo-color-picker__panel', popperClass || '']"
      v-model="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      :color="color"
      :append-to-body="appendToBody"
      :placement="popoverPlacement"
      :show-alpha="showAlpha"
      :predefine="predefine">
    </picker-dropdown>
  </div>
</template>

<script>
import Color from './color';
import PickerDropdown from './components/picker-dropdown.vue';
import Clickoutside from 'rumo-ui/src/utils/clickoutside';

export default {
  name: 'RumoColorPicker',

  props: {
    value: String,
    appendToBody: {
      type: Boolean,
      default: true
    },
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array,
    popoverPlacement: {
      type: String,
      default: 'bottom-start'
    }
  },

  inject: {
    rumoForm: {
      default: ''
    },
    rumoFormItem: {
      default: ''
    }
  },

  directives: { Clickoutside },

  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return 'transparent';
      }

      return this.displayedRgb(this.color, this.showAlpha);
    },

    _rumoFormItemSize() {
      return (this.rumoFormItem || {}).rumoFormItemSize;
    },

    colorSize() {
      return this.size || this._rumoFormItemSize || (this.$RUMO || {}).size;
    },

    colorDisabled() {
      return this.disabled || (this.rumoForm || {}).disabled;
    }
  },

  watch: {
    value(val) {
      if (!val) {
        this.showPanelColor = false;
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true;
      }
    },
    displayedColor(val) {
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      currentValueColor.fromString(this.value);
      const currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha);
      if (val !== currentValueColorRgb) {
        this.$emit('active-change', val);
      }
    }
  },

  methods: {
    handleTrigger() {
      if (this.colorDisabled) return;
      this.showPicker = !this.showPicker;
    },
    confirmValue(value) {
      this.$emit('input', this.color.value);
      this.$emit('change', this.color.value);
      this.showPicker = false;
    },
    clearValue() {
      this.$emit('input', null);
      this.$emit('change', null);
      this.showPanelColor = false;
      this.showPicker = false;
      this.resetColor();
    },
    hide() {
      this.showPicker = false;
      this.resetColor();
    },
    resetColor() {
      this.$nextTick(_ => {
        if (this.value) {
          this.color.fromString(this.value);
        } else {
          this.showPanelColor = false;
        }
      });
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class');
      }

      const { r, g, b } = color.toRgb();
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})`
        : `rgb(${r}, ${g}, ${b})`;
    }
  },

  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }
    this.popperElm = this.$refs.dropdown.$el;
  },

  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });
    return {
      color,
      showPicker: false,
      showPanelColor: false
    };
  },

  components: {
    PickerDropdown
  }
};
</script>
