<template>
  <div class="rumo-date-range-preset">
    <button
      v-for="p in normalizedPresets"
      :key="p.key"
      type="button"
      class="rumo-date-range-preset__chip"
      :class="{ 'is-active': activePreset === p.key }"
      @click="applyPreset(p)"
    >{{ p.label }}</button>

    <rumo-popover
      ref="popover"
      trigger="click"
      placement="bottom-start"
      width="260"
      v-model="popoverVisible"
    >
      <div class="rumo-date-range-preset__panel">
        <rumo-date-picker
          v-model="draftRange"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
          :style="{ width: '100%' }"
        />
        <div class="rumo-date-range-preset__actions">
          <rumo-button size="mini" @click="popoverVisible = false">{{ cancelText }}</rumo-button>
          <rumo-button size="mini" type="primary" :disabled="!draftRange || !draftRange[0]" @click="applyCustom">{{ applyText }}</rumo-button>
        </div>
      </div>
      <rumo-button
        slot="reference"
        size="small"
        :class="{ 'is-active': activePreset === 'custom' }"
      >{{ customLabel }}</rumo-button>
    </rumo-popover>
  </div>
</template>

<script>
function formatDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}

function parseDate(str) {
  if (!str) return null;
  const parts = String(str).split('-');
  if (parts.length !== 3) return null;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(d.getTime()) ? null : d;
}

function shiftDays(base, days) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

export default {
  name: 'RumoDateRangePreset',

  props: {
    // 预设:{ key?, label, days? } 或 { key?, label, from, to }(YYYY-MM-DD)
    presets: {
      type: Array,
      default() {
        return [
          { key: '7d', label: '7d', days: 7 },
          { key: '30d', label: '30d', days: 30 },
          { key: '90d', label: '90d', days: 90 }
        ];
      }
    },
    // v-model: [from, to](YYYY-MM-DD)
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    customLabel: {
      type: String,
      default: 'Custom'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    applyText: {
      type: String,
      default: 'Apply'
    },
    // 传入时高亮对应预设;缺省按 value 反推
    activeKey: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      popoverVisible: false,
      draftRange: null
    };
  },

  computed: {
    normalizedPresets() {
      return this.presets.map((p, idx) => ({
        key: (p && p.key) != null ? p.key : 'p' + idx,
        label: (p && p.label) || '',
        days: p && p.days,
        from: p && p.from,
        to: p && p.to
      }));
    },
    activePreset() {
      if (this.activeKey) return this.activeKey;
      const val = this.value || [];
      const from = val[0];
      const to = val[1];
      if (!from || !to) return '';
      const today = new Date();
      for (let i = 0; i < this.normalizedPresets.length; i++) {
        const p = this.normalizedPresets[i];
        let pFrom;
        let pTo;
        if (p.days) {
          pTo = formatDate(today);
          pFrom = formatDate(shiftDays(today, -(p.days - 1)));
        } else if (p.from && p.to) {
          pFrom = p.from;
          pTo = p.to;
        } else {
          continue;
        }
        if (pFrom === from && pTo === to) return p.key;
      }
      return 'custom';
    },
    pickerOptions() {
      return {
        disabledDate: () => false
      };
    }
  },

  watch: {
    popoverVisible(visible) {
      if (visible) {
        const val = this.value || [];
        const from = parseDate(val[0]);
        const to = parseDate(val[1]);
        this.draftRange = from ? [from, to || from] : null;
      }
    }
  },

  methods: {
    applyPreset(preset) {
      let from;
      let to;
      if (preset.days) {
        const today = new Date();
        to = formatDate(today);
        from = formatDate(shiftDays(today, -(preset.days - 1)));
      } else if (preset.from && preset.to) {
        from = preset.from;
        to = preset.to;
      } else {
        return;
      }
      this.emitChange(from, to, preset.key);
    },
    applyCustom() {
      const range = this.draftRange;
      if (!range || !range[0]) return;
      const from = formatDate(range[0]);
      const to = range[1] ? formatDate(range[1]) : from;
      this.popoverVisible = false;
      this.emitChange(from, to, 'custom');
    },
    emitChange(from, to, preset) {
      this.$emit('input', [from, to]);
      this.$emit('change', { from, to, preset });
      this.$emit('preset-click', preset);
    }
  }
};
</script>
