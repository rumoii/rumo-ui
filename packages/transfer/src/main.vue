<template>
  <div class="rumo-transfer">
    <transfer-panel v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :model="model"
      :width="width"
      :column-data="columnData"
      :autofilter="autofilter"
      :title="titles[0] || t('rumo.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('rumo.transfer.filterPlaceholder')"
      :loading="leftLoading"
      :disabled-waterfall="disabledLeftWaterfall"
      @update="updateLeftData"
      @load="$emit('left-load')"
      @checked-change="onSourceCheckedChange">
      <template #custom-search>
        <slot name="left-search" />
      </template>
      <slot name="left-footer" />
    </transfer-panel>
    <div class="rumo-transfer__buttons">
      <rumo-button type="primary"
        :class="['rumo-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0"
        icon="icon-left-line">
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </rumo-button>
      <rumo-button type="primary"
        :class="['rumo-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0"
        icon="icon-right-line">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
      </rumo-button>
    </div>
    <transfer-panel v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :model="model"
      :width="width"
      :loading="false"
      :column-data="columnData"
      :autofilter="autofilter"
      :disabled-waterfall="true"
      :title="titles[1] || t('rumo.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('rumo.transfer.filterPlaceholder')"
      @update="updateRightData"
      @checked-change="onTargetCheckedChange">
      <template #custom-search>
        <slot name="right-search" />
      </template>
      <slot name="right-footer" />
    </transfer-panel>
  </div>
</template>

<script>
import RumoButton from 'rumo-ui/packages/button';
import Emitter from 'rumo-ui/src/mixins/emitter';
import Locale from 'rumo-ui/src/mixins/locale';
import TransferPanel from './transfer-panel.vue';
import Migrating from 'rumo-ui/src/mixins/migrating';

export default {
  name: 'RumoTransfer',

  mixins: [Emitter, Locale, Migrating],

  components: {
    TransferPanel,
    RumoButton
  },

  props: {
    disabledLeftWaterfall: {
      type: Boolean,
      default: true
    },
    leftLoading: {
      type: Boolean,
      default: false
    },
    rightLoading: {
      type: Boolean,
      default: false
    },
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
    titles: {
      type: Array,
      default() {
        return [];
      }
    },
    buttonTexts: {
      type: Array,
      default() {
        return [];
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    format: {
      type: Object,
      default() {
        return {};
      }
    },
    filterable: Boolean,
    areafilterable: Boolean,
    areaOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    areaLabel: {
      type: String,
      default() {
        return '区域';
      }
    },
    autofilter: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        };
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    }
  },

  data() {
    return {
      leftChecked: [],
      rightChecked: []
    };
  },

  computed: {
    dataObj() {
      const key = this.props.key;
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
    },

    sourceData() {
      return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1);
    },

    targetData() {
      return this.targetOrder === 'original'
        ? this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)
        : this.value.map(key => this.dataObj[key]);
    },

    hasButtonTexts() {
      return this.buttonTexts.length === 2;
    }
  },

  watch: {
    value(val) {
      this.dispatch('RumoFormItem', 'rumo.form.change', val);
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.'
        }
      };
    },

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val;
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val;
    },

    addToLeft() {
      let currentValue = this.value.slice();
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
        }
      });
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'left', this.rightChecked);
    },

    addToRight() {
      let currentValue = this.value.slice();
      const itemsToBeMoved = [];
      const key = this.props.key;
      this.data.forEach(item => {
        const itemKey = item[key];
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
          this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey);
        }
      });
      currentValue = this.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved);
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'right', this.leftChecked);
    },

    // 新增用于表格列表方法 @孙梦瑶
    updateLeftData(query, areaQuery) {
      this.$emit('update-left-data', query, areaQuery, this.sourceData);
    },

    updateRightData(query, areaQuery) {
      this.$emit('update-right-data', query, areaQuery, this.targetData);
    },

    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = '';
      } else if (which === 'right') {
        this.$refs.rightPanel.query = '';
      }
    },

    clearSelectQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.areaQuery = [];
      } else if (which === 'right') {
        this.$refs.rightPanel.areaQuery = [];
      }
    },

    leftManulSearch(query) {
      this.$refs.leftPanel.query = query
    },

    rightManulSearch(query) {
      this.$refs.rightPanel.query = query
    },

    leftCustomFilter(fun) {
      this.$refs.leftPanel.setCustomFilteredData(fun)
    },
    rightCustomFilter(fun) {
      this.$refs.rightPanel.setCustomFilteredData(fun)
    }
  }
};
</script>
