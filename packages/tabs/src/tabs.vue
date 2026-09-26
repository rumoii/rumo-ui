<script>
import TabNav from './tab-nav';

export default {
  name: 'RumoTabs',

  components: {
    TabNav
  },

  props: {
    type: String,
    activeName: String,
    closable: Boolean,
    closeIcon: String,
    closeIconClass: String,
    addable: Boolean,
    value: {},
    editable: Boolean,
    tabPosition: {
      type: String,
      default: 'top'
    },
    beforeLeave: Function,
    stretch: Boolean,
    isCenter: {
      type: Boolean,
      default: false
    },
    headerHeight: String
  },

  provide() {
    return {
      rootTabs: this
    };
  },

  data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    };
  },

  watch: {
    activeName(value) {
      this.setCurrentName(value);
    },
    value(value) {
      this.setCurrentName(value);
    },
    currentName(value) {
      if (this.$refs.nav) {
        this.$nextTick(_ => {
          this.$refs.nav.scrollToActiveTab();
        });
      }
    }
  },

  methods: {
    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return;
      this.setCurrentName(tabName);
      this.$emit('tab-click', tab, event);
    },
    handleTabRemove(pane, ev) {
      if (pane.disabled) return;
      ev.stopPropagation();
      this.$emit('edit', pane.name, 'remove');
      this.$emit('tab-remove', pane.name);
    },
    handleTabAdd() {
      this.$emit('edit', null, 'add');
      this.$emit('tab-add');
    },
    setCurrentName(value) {
      const changeCurrentName = () => {
        this.currentName = value;
        this.$emit('input', value);
      };
      if (this.currentName !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentName);
        if (before && before.then) {
          before
            .then(() => {
              changeCurrentName();
              this.$refs.nav && this.$refs.nav.removeFocus();
            }, () => {
              // ignore promise rejection in `before-leave` hook
            });
        } else if (before !== false) {
          changeCurrentName();
        }
      } else {
        changeCurrentName();
      }
    },
    addPanes(item) {
      const index = this.$slots.default.filter(item => {
        return item.elm.nodeType === 1 && /\bcut-tab-pane\b/.test(item.elm.className);
      }).indexOf(item.$vnode);
      this.panes.splice(index, 0, item);
    },
    removePanes(item) {
      const panes = this.panes;
      const index = panes.indexOf(item);
      if (index > -1) {
        panes.splice(index, 1);
      }
    }
  },
  render(h) {
    let {
      type,
      handleTabClick,
      handleTabRemove,
      handleTabAdd,
      currentName,
      panes,
      editable,
      addable,
      tabPosition,
      stretch,
      isCenter,
      closeIcon,
      closeIconClass,
      headerHeight
    } = this;

    const newButton = editable || addable
      ? (
        <span
          class="rumo-tabs__new-tab"
          on-click={handleTabAdd}
          tabindex="0"
          on-keydown={(ev) => { if (ev.keyCode === 13) { handleTabAdd(); } }}
        >
          <i class="rumo-icons icon-add rumo-icons-18"></i>
        </span>
      )
      : null;

    const navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch,
        isCenter,
        closeIcon,
        closeIconClass,
        headerHeight
      },
      ref: 'nav'
    };
    const header = (
      <div class={['rumo-tabs__header', `is-${tabPosition}`]}>
        {newButton}
        <tab-nav { ...navData }></tab-nav>
      </div>
    );
    const panels = (
      <div class="rumo-tabs__content">
        {this.$slots.default}
      </div>
    );

    return (
      <div class={{
        'rumo-tabs': true,
        'rumo-tabs--card': type === 'card',
        [`rumo-tabs--${tabPosition}`]: true,
        'rumo-tabs--border-card': type === 'border-card',
        'is-button': isCenter
      }}>
        {tabPosition !== 'bottom' ? [header, panels] : [panels, header]}
      </div>
    );
  },
  created() {
    if (!this.currentName) {
      this.setCurrentName('0');
    }
  }
};
</script>
