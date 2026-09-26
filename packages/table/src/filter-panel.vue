<template>
  <transition name="rumo-zoom-in-top">
    <div class="rumo-table-filter"
      v-if="multiple"
      v-clickoutside="handleOutsideClick"
      v-show="showPopper">
      <div class="rumo-table-filter__content">
        <rumo-scrollbar wrap-class="rumo-table-filter__wrap">
          <rumo-checkbox-group class="rumo-table-filter__checkbox-group"
            v-model="filteredValue">
            <rumo-checkbox v-for="filter in filters"
              :key="filter.value"
              :label="filter.value">{{ filter.text }}</rumo-checkbox>
          </rumo-checkbox-group>
        </rumo-scrollbar>
      </div>
      <div class="rumo-table-filter__bottom">
        <button @click="handleConfirm"
          :class="{ 'is-disabled': filteredValue.length === 0 }"
          :disabled="filteredValue.length === 0">{{ t('rumo.table.confirmFilter') }}</button>
        <button @click="handleReset">{{ t('rumo.table.resetFilter') }}</button>
      </div>
    </div>
    <div class="rumo-table-filter"
      v-else
      v-clickoutside="handleOutsideClick"
      v-show="showPopper">
      <div class="rumo-table-filter__content">
        <rumo-scrollbar wrap-class="rumo-table-filter__wrap">
          <ul class="rumo-table-filter__list">
            <li class="rumo-table-filter__list-item"
              :class="{ 'is-active': filterValue === undefined || filterValue === null }"
              @click="handleSelect(null)">{{ t('rumo.table.clearFilter') }}</li>
            <li class="rumo-table-filter__list-item"
              v-for="filter in filters"
              :label="filter.value"
              :key="filter.value"
              :class="{ 'is-active': isActive(filter) }"
              @click="handleSelect(filter.value)">{{ filter.text }}</li>
          </ul>
        </rumo-scrollbar>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popper from 'rumo-ui/src/utils/vue-popper';
import { PopupManager } from 'rumo-ui/src/utils/popup';
import Locale from 'rumo-ui/src/mixins/locale';
import Clickoutside from 'rumo-ui/src/utils/clickoutside';
import Dropdown from './dropdown';
import RumoCheckbox from 'rumo-ui/packages/checkbox';
import RumoCheckboxGroup from 'rumo-ui/packages/checkbox-group';

export default {
  name: 'RumoTableFilterPanel',

  mixins: [Popper, Locale],

  directives: {
    Clickoutside
  },

  components: {
    RumoCheckbox,
    RumoCheckboxGroup
  },

  props: {
    placement: {
      type: String,
      default: 'bottom-end'
    }
  },

  customRender(h) {
    return (<div class="rumo-table-filter">
      <div class="rumo-table-filter__content">
      </div>
      <div class="rumo-table-filter__bottom">
        <button on-click={this.handleConfirm}>{this.t('rumo.table.confirmFilter')}</button>
        <button on-click={this.handleReset}>{this.t('rumo.table.resetFilter')}</button>
      </div>
    </div>);
  },

  methods: {
    isActive(filter) {
      return filter.value === this.filterValue;
    },

    handleOutsideClick() {
      setTimeout(() => {
        this.showPopper = false;
      }, 16);
    },

    handleConfirm() {
      this.confirmFilter(this.filteredValue);
      this.handleOutsideClick();
    },

    handleReset() {
      this.filteredValue = [];
      this.confirmFilter(this.filteredValue);
      this.handleOutsideClick();
    },

    handleSelect(filterValue) {
      this.filterValue = filterValue;

      if ((typeof filterValue !== 'undefined') && (filterValue !== null)) {
        this.confirmFilter(this.filteredValue);
      } else {
        this.confirmFilter([]);
      }

      this.handleOutsideClick();
    },

    confirmFilter(filteredValue) {
      this.table.store.commit('filterChange', {
        column: this.column,
        values: filteredValue
      });
      this.table.store.updateAllSelected();
    }
  },

  data() {
    return {
      table: null,
      cell: null,
      column: null
    };
  },

  computed: {
    filters() {
      return this.column && this.column.filters;
    },

    filterValue: {
      get() {
        return (this.column.filteredValue || [])[0];
      },
      set(value) {
        if (this.filteredValue) {
          if ((typeof value !== 'undefined') && (value !== null)) {
            this.filteredValue.splice(0, 1, value);
          } else {
            this.filteredValue.splice(0, 1);
          }
        }
      }
    },

    filteredValue: {
      get() {
        if (this.column) {
          return this.column.filteredValue || [];
        }
        return [];
      },
      set(value) {
        if (this.column) {
          this.column.filteredValue = value;
        }
      }
    },

    multiple() {
      if (this.column) {
        return this.column.filterMultiple;
      }
      return true;
    }
  },

  mounted() {
    this.popperElm = this.$el;
    this.referenceElm = this.cell;
    this.table.bodyWrapper.addEventListener('scroll', () => {
      this.updatePopper();
    }, { passive: true });

    this.$watch('showPopper', (value) => {
      if (this.column) this.column.filterOpened = value;
      if (value) {
        Dropdown.open(this);
      } else {
        Dropdown.close(this);
      }
    });
  },
  watch: {
    showPopper(val) {
      if (val === true && parseInt(this.popperJS._popper.style.zIndex) < PopupManager.zIndex) {
        this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      }
    }
  }
};
</script>
