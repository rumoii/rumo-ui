<template>
  <transition name="rumo-zoom-in-top"
    @after-leave="doDestroy">
    <div v-show="showPopper"
      class="rumo-autocomplete-suggestion rumo-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region">
      <rumo-scrollbar tag="ul"
        wrap-class="rumo-autocomplete-suggestion__wrap"
        view-class="rumo-autocomplete-suggestion__list">
        <li v-if="!parent.hideLoading && parent.loading">
          <i class="rumo-icons icon-refresh rumo-icons-spin"></i>
        </li>
        <slot v-else>
        </slot>
      </rumo-scrollbar>
    </div>
  </transition>
</template>
<script>
import Popper from 'rumo-ui/src/utils/vue-popper';
import Emitter from 'rumo-ui/src/mixins/emitter';
import RumoScrollbar from 'rumo-ui/packages/scrollbar';

export default {
  components: { RumoScrollbar },
  mixins: [Popper, Emitter],

  componentName: 'RumoAutocompleteSuggestions',

  data() {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    };
  },

  props: {
    options: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    id: String
  },

  methods: {
    select(item) {
      this.dispatch('RumoAutocomplete', 'item-click', item);
    }
  },

  updated() {
    this.$nextTick(_ => {
      this.popperJS && this.updatePopper();
    });
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$refs.input.$refs.input;
    this.referenceList = this.$el.querySelector('.rumo-autocomplete-suggestion__list');
    this.referenceList.setAttribute('role', 'listbox');
    this.referenceList.setAttribute('id', this.id);
  },

  created() {
    this.$on('visible', (val, inputWidth) => {
      this.dropdownWidth = inputWidth + 'px';
      this.showPopper = val;
    });
  }
};
</script>
