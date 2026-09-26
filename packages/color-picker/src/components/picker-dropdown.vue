<template>
  <transition name="rumo-zoom-in-top"
    @after-leave="doDestroy">
    <div class="rumo-color-dropdown"
      v-show="showPopper">
      <div class="rumo-color-dropdown__main-wrapper">
        <hue-slider ref="hue"
          :color="color"
          vertical
          style="float: right;"></hue-slider>
        <sv-panel ref="sl"
          :color="color"></sv-panel>
      </div>
      <alpha-slider v-if="showAlpha"
        ref="alpha"
        :color="color"></alpha-slider>
      <predefine v-if="predefine"
        :color="color"
        :colors="predefine"></predefine>
      <div class="rumo-color-dropdown__btns">
        <span class="rumo-color-dropdown__value">
          <rumo-input v-model="customInput"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
            size="mini">
          </rumo-input>
        </span>
        <rumo-button size="mini"
          text
          class="rumo-color-dropdown__link-btn"
          @click="$emit('clear')">
          {{ t('rumo.colorpicker.clear') }}
        </rumo-button>
        <rumo-button plain
          size="mini"
          class="rumo-color-dropdown__btn"
          @click="confirmValue">
          {{ t('rumo.colorpicker.confirm') }}
        </rumo-button>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from './sv-panel';
import HueSlider from './hue-slider';
import AlphaSlider from './alpha-slider';
import Predefine from './predefine';
import Popper from 'rumo-ui/src/utils/vue-popper';
import Locale from 'rumo-ui/src/mixins/locale';
import RumoInput from 'rumo-ui/packages/input';
import RumoButton from 'rumo-ui/packages/button';
export default {
  name: 'rumo-color-picker-dropdown',
  mixins: [Popper, Locale],
  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    RumoInput,
    RumoButton,
    Predefine
  },
  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array
  },
  data() {
    return {
      customInput: ''
    };
  },
  computed: {
    currentColor() {
      const parent = this.$parent;
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value;
    }
  },
  methods: {
    confirmValue() {
      this.$emit('pick');
    },
    handleConfirm() {
      this.color.fromString(this.customInput);
    }
  },
  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  },
  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs;
          sl && sl.update();
          hue && hue.update();
          alpha && alpha.update();
        });
      }
    },
    currentColor(val) {
      this.customInput = val;
    }
  }
};
</script>