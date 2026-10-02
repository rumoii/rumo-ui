<template>
  <rumo-dialog
    :visible="visible"
    :title="title"
    :width="width"
    custom-class="rumo-trend-zoom"
    append-to-body
    @update:visible="handleVisibleChange"
  >
    <rumo-trend-chart
      embedded
      :series="series"
      :labels="labels"
      :missing="missing"
      :future="future"
      :formatter="formatter"
      :height="chartHeight"
      @bar-click="handleBarClick"
    />
  </rumo-dialog>
</template>

<script>
import RumoDialog from 'rumo-ui/packages/dialog';
import RumoTrendChart from './main';

export default {
  name: 'RumoTrendZoom',

  components: {
    RumoDialog: RumoDialog,
    RumoTrendChart: RumoTrendChart
  },

  model: {
    prop: 'visible',
    event: 'update:visible'
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 与 RumoTrendChart 同语义:null 为缺口
    series: {
      type: Array,
      default() {
        return [];
      }
    },
    labels: {
      type: Array,
      default() {
        return [];
      }
    },
    missing: {
      type: Array,
      default() {
        return [];
      }
    },
    future: {
      type: Array,
      default() {
        return [];
      }
    },
    formatter: {
      type: Function,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '72%'
    }
  },

  computed: {
    chartHeight() {
      return 420;
    }
  },

  methods: {
    handleVisibleChange(val) {
      this.$emit('update:visible', val);
      if (!val) this.$emit('close');
    },

    handleBarClick(seg) {
      this.$emit('bar-click', seg);
    }
  }
};
</script>
