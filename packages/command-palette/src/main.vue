<template>
  <div
    v-if="visible"
    class="rumo-command-palette"
    @click.self="close"
  >
    <div class="rumo-command-palette__panel">
      <div class="rumo-command-palette__search">
        <input
          ref="input"
          v-model="query"
          class="rumo-command-palette__input"
          type="text"
          :placeholder="placeholderText"
          @keydown="onInputKeydown"
        />
      </div>
      <ul ref="list" class="rumo-command-palette__list">
        <li
          v-for="(cmd, index) in filtered"
          :key="cmd.id"
          class="rumo-command-palette__item"
          :class="{ 'is-active': index === activeIndex }"
          @mouseenter="activeIndex = index"
          @click="select(cmd)"
        >
          <span v-if="cmd.icon" class="rumo-command-palette__icon">{{ cmd.icon }}</span>
          <span class="rumo-command-palette__title">{{ cmd.title }}</span>
          <span v-if="cmd.category" class="rumo-command-palette__category">{{ cmd.category }}</span>
          <span v-if="cmd.shortcut" class="rumo-command-palette__shortcut">{{ cmd.shortcut }}</span>
        </li>
        <li v-if="!filtered.length" class="rumo-command-palette__empty">
          {{ emptyText }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Locale from 'rumo-ui/src/mixins/locale';

// 组合键解析:'ctrl+k, command+k' → [{ mods, key }]
// command = meta(mac 的 ⌘ / Windows 的 Win 键)
const MODIFIER_NAMES = ['ctrl', 'control', 'meta', 'command', 'alt', 'shift'];

function parseHotkey(str) {
  return String(str)
    .split(',')
    .map(part => part.trim().toLowerCase())
    .filter(Boolean)
    .map(part => {
      const keys = part.split('+').map(k => k.trim()).filter(Boolean);
      const combo = { ctrl: false, meta: false, alt: false, shift: false, key: '' };
      keys.forEach(k => {
        if (k === 'ctrl' || k === 'control') combo.ctrl = true;
        else if (k === 'meta' || k === 'command') combo.meta = true;
        else if (k === 'alt') combo.alt = true;
        else if (k === 'shift') combo.shift = true;
        else combo.key = k;
      });
      return combo;
    })
    .filter(c => c.key && MODIFIER_NAMES.indexOf(c.key) === -1);
}

function matchCombo(e, combo) {
  return (
    e.ctrlKey === combo.ctrl &&
    e.metaKey === combo.meta &&
    e.altKey === combo.alt &&
    e.shiftKey === combo.shift &&
    String(e.key).toLowerCase() === combo.key
  );
}

function isTextInput(el) {
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable;
}

export default {
  name: 'RumoCommandPalette',

  mixins: [Locale],

  model: {
    prop: 'visible',
    event: 'update:visible'
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    commands: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    hotkey: {
      type: [String, Boolean],
      default: 'ctrl+k, command+k'
    },
    scope: {
      type: [String, Object],
      default: 'global'
    }
  },

  data() {
    return {
      query: '',
      activeIndex: 0
    };
  },

  computed: {
    placeholderText() {
      return this.placeholder || this.t('rumo.commandPalette.placeholder');
    },
    emptyText() {
      return this.t('rumo.commandPalette.empty');
    },
    filtered() {
      const q = this.query.trim().toLowerCase();
      const list = this.commands.slice();
      if (!q) return list;
      const matched = [];
      list.forEach(cmd => {
        const title = String(cmd.title || '').toLowerCase();
        const category = String(cmd.category || '').toLowerCase();
        const shortcut = String(cmd.shortcut || '').toLowerCase();
        let rank = -1;
        if (title.indexOf(q) !== -1) rank = 0;
        else if (category.indexOf(q) !== -1) rank = 1;
        else if (shortcut.indexOf(q) !== -1) rank = 2;
        if (rank !== -1) matched.push({ cmd, rank });
      });
      matched.sort((a, b) => a.rank - b.rank);
      return matched.map(m => m.cmd);
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.query = '';
        this.activeIndex = 0;
        this.$nextTick(() => {
          if (this.$refs.input) {
            this.$refs.input.focus();
          }
        });
      }
    },
    filtered() {
      this.activeIndex = 0;
    }
  },

  mounted() {
    this._combos = [];
    this._bindHotkey();
  },

  beforeDestroy() {
    this._unbindHotkey();
  },

  methods: {
    _getScopeElement() {
      if (this.scope === 'global' || !this.scope) return document;
      if (typeof this.scope === 'string') {
        return document.querySelector(this.scope) || document;
      }
      return this.scope;
    },

    _bindHotkey() {
      if (this.hotkey === false) return;
      this._combos = parseHotkey(this.hotkey);
      if (!this._combos.length) return;
      this._scopeEl = this._getScopeElement();
      this._onKeydown = this._handleHotkey.bind(this);
      this._scopeEl.addEventListener('keydown', this._onKeydown, true);
    },

    _unbindHotkey() {
      if (this._scopeEl && this._onKeydown) {
        this._scopeEl.removeEventListener('keydown', this._onKeydown, true);
      }
      this._scopeEl = null;
      this._onKeydown = null;
      this._combos = [];
    },

    _handleHotkey(e) {
      const combo = this._combos.find(c => matchCombo(e, c));
      if (!combo) return;

      // 输入控件避让:焦点在 input/textarea/contenteditable 时,
      // 无修饰键的组合跳过拦截(不劫持打字);含 Ctrl/Meta/Alt 的组合(如 Ctrl+K)照常触发。
      // 注:方案 §6.1 该句表述含混,此处按「不打扰打字」的意图取舍。
      const hasModifier = combo.ctrl || combo.meta || combo.alt;
      if (!hasModifier && isTextInput(e.target)) return;

      e.preventDefault();
      e.stopPropagation();
      this.$emit('update:visible', !this.visible);
    },

    onInputKeydown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.filtered.length) {
          this.activeIndex = (this.activeIndex + 1) % this.filtered.length;
          this._scrollActiveIntoView();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.filtered.length) {
          this.activeIndex =
            (this.activeIndex - 1 + this.filtered.length) % this.filtered.length;
          this._scrollActiveIntoView();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.filtered[this.activeIndex];
        if (cmd) this.select(cmd);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    },

    _scrollActiveIntoView() {
      this.$nextTick(() => {
        const list = this.$refs.list;
        if (!list) return;
        const active = list.children[this.activeIndex];
        if (active && active.scrollIntoView) {
          active.scrollIntoView({ block: 'nearest' });
        }
      });
    },

    select(cmd) {
      this.$emit('select', cmd);
      this.close();
    },

    close() {
      this.$emit('update:visible', false);
    }
  }
};
</script>
