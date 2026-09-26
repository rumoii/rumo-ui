<template>
  <div class="rumo-transfer-panel"
    :style="{width: width}">
    <p class="rumo-transfer-panel__header">
      <template v-if="model === 'table'">
        <div class="rumo-transfer-header">
          {{ title }}
          <span>{{ checkedSummary }}</span>
        </div>
      </template>
      <template v-else>
        <rumo-checkbox v-if="model === 'checkbox'"
          v-model="allChecked"
          @change="handleAllCheckedChange"
          :indeterminate="isIndeterminate">
          {{ title }}
          <span>{{ checkedSummary }}</span>
        </rumo-checkbox>
      </template>
    </p>

    <div v-loading="loading"
      rumo-loading-text="拼命加载中"
      rumo-loading-prevent-scroll="true"
      :class="['rumo-transfer-panel__body', hasFooter ? 'is-with-footer' : '', areafilterable ? 'is-with-area-select' : '', filterable ? 'is-with-input' : '']">
      <div v-if="areafilterable"
        class="rumo-transfer-panel__areafilter">
        <!-- <span>{{areaLabel}}</span> -->
        <rumo-cascader :options="areaOptions"
          v-model="areaQuery"
          :placeholder="'请选择'+ areaLabel"
          change-on-select
          clearable
          @change="handleAreaChange"></rumo-cascader>
      </div>
      <slot name="custom-search" />
      <rumo-input class="rumo-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          class="rumo-icons"
          :class="['rumo-input__icon', 'icon-' + inputIcon]"
          @click="clearQuery"></i>
      </rumo-input>
      <rumo-table v-if="model === 'table'"
        :cell-style="cellStyle"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="rumo-transfer-panel__list"
        ref="tranferTable"
        :data="filteredData"
        style="width: 100%; overflow: inherit"
        height="225"
        @selection-change="handleSelectionChange">
        <rumo-table-column type="selection"
          width="55"></rumo-table-column>
        <rumo-table-column v-for="(item,index) in columnData"
          :key="'columnData'+index"
          :prop="item.id"
          v-bind="item"></rumo-table-column>
      </rumo-table>
      <rumo-checkbox-group v-else
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="rumo-transfer-panel__list"
        v-waterfall-lower="loadMore"
        :waterfall-offset="50">
        <rumo-checkbox class="rumo-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
          <option-content :option="item"></option-content>
        </rumo-checkbox>
      </rumo-checkbox-group>
      <p class="rumo-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('rumo.transfer.noMatch') }}</p>
      <p class="rumo-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('rumo.transfer.noData') }}</p>
    </div>
    <p class="rumo-transfer-panel__footer"
      v-if="hasFooter">
      <slot />
    </p>
  </div>
</template>

<script>
import RumoCheckboxGroup from 'rumo-ui/packages/checkbox-group';
import RumoTable from 'rumo-ui/packages/table';
import RumoCheckbox from 'rumo-ui/packages/checkbox';
import RumoInput from 'rumo-ui/packages/input';
import RumoCascader from 'rumo-ui/packages/cascader';
import Waterfall from 'rumo-ui/src/utils/waterfall';
import Locale from 'rumo-ui/src/mixins/locale';

export default {
  directives: {
    WaterfallLower: Waterfall('lower'),
    WaterfallUpper: Waterfall('upper')
  },
  mixins: [Locale],

  name: 'RumoTransferPanel',

  componentName: 'RumoTransferPanel',

  components: {
    RumoTable,
    RumoCheckboxGroup,
    RumoCheckbox,
    RumoInput,
    RumoCascader,
    OptionContent: {
      props: {
        option: Object
      },
      render(h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'RumoTransferPanel') {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        const panel = getParent(this);
        const transfer = panel.$parent || panel;
        return panel.renderContent
          ? panel.renderContent(h, this.option)
          : transfer.$scopedSlots.default
            ? transfer.$scopedSlots.default({ option: this.option })
            : <span>{this.option[panel.labelProp] || this.option[panel.keyProp]}</span>;
      }
    }
  },

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    model: {
      type: String,
      default() {
        return 'checkbox';
      }
    },
    columnData: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: String,
      default() {
        return '200px';
      }
    },
    areaOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    areaLabel: {
      type: String,
      default() {
        return '区域：';
      }
    },
    autofilter: {
      type: Boolean,
      default: true
    },
    disabledWaterfall: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    areafilterable: Boolean,
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object
  },

  data() {
    return {
      checked: [],
      allChecked: false,
      query: '',
      areaQuery: [],
      inputHover: false,
      checkChangeByUser: true,
      cellStyle: { border: '0px', padding: '2px 0' },
      filteredData: []
    };
  },

  watch: {
    query: {
      immediate: true,
      handler(val) {
        this.$emit('update', val, this.areaQuery);
        this.filteredData = this.getFilteredData()
      }
    },
    areaQuery(val) {
      this.$emit('update', this.query, val);
    },
    checked(val, oldVal) {
      this.updateAllChecked();
      if (this.checkChangeByUser) {
        const movedKeys = val.concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit('checked-change', val, movedKeys);
      } else {
        this.$emit('checked-change', val);
        this.checkChangeByUser = true;
      }
    },

    data() {
      const checked = [];
      this.filteredData = this.getFilteredData()

      const filteredDataKeys = this.filteredData.map(item => item[this.keyProp]);
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item);
        }
      });
      this.checkChangeByUser = false;
      this.checked = checked;
    },

    checkableData() {
      this.updateAllChecked();
    },

    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (oldVal && val.length === oldVal.length &&
          val.every(item => oldVal.indexOf(item) > -1)) return;
        const checked = [];
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      }
    },
  },

  computed: {

    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp]);
    },

    checkedSummary() {
      const checkedLength = this.checked.length;
      const dataLength = this.data.length;
      const { noChecked, hasChecked } = this.format;
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength);
      } else {
        return `${checkedLength}/${dataLength}`;
      }
    },

    isIndeterminate() {
      const checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.checkableData.length;
    },

    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0;
    },

    inputIcon() {
      return this.query.length > 0 && this.inputHover
        ? 'close-fill'
        : 'search';
    },

    labelProp() {
      return this.props.label || 'label';
    },

    keyProp() {
      return this.props.key || 'key';
    },

    disabledProp() {
      return this.props.disabled || 'disabled';
    },

    hasFooter() {
      return !!this.$slots.default;
    }
  },

  methods: {
    loadMore() {
      if (this.disabledWaterfall) {
        return;
      }
      this.$emit('load');
    },
    updateAllChecked() {
      const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
      this.allChecked = checkableDataKeys.length > 0 &&
        checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
    },

    handleAllCheckedChange(value) {
      this.checked = value
        ? this.checkableData.map(item => item[this.keyProp])
        : [];
    },

    clearQuery() {
      if (this.inputIcon === 'close-fill') {
        this.query = '';
      }
    },
    handleSelectionChange(val) {
      let _array = [];
      for (let k in val) {
        _array.push(val[k].key);
      }
      this.checked = _array;
    },
    handleAreaChange(val) {
      this.areaQuery = val;
    },
    getFilteredData() {
      if (this.autofilter) {
        return this.data.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.query, item);
          } else {
            const label = item[this.labelProp] || item[this.keyProp].toString();
            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          }
        });
      } else {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, this.data);
        } else {
          return this.data;
        }
      }
    },
    setCustomFilteredData(fun) {
      this.filteredData = fun(this.data)
    }
  }
};
</script>
