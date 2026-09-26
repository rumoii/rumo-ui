<script>
import TabBar from './tab-bar';
import { addResizeListener, removeResizeListener } from 'rumo-ui/src/utils/resize-event';

function noop() { }
const firstUpperCase = str => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

export default {
  name: 'TabNav',

  components: {
    TabBar
  },

  inject: ['rootTabs'],

  props: {
    panes: Array,
    currentName: String,
    editable: Boolean,
    onTabClick: {
      type: Function,
      default: noop
    },
    onTabRemove: {
      type: Function,
      default: noop
    },
    type: String,
    isCenter: {
      type: Boolean,
      default: false
    },
    closeIcon: String,
    closeIconClass: String,
    headerHeight: String
  },

  data() {
    return {
      scrollable: false,
      navOffset: 0,
      isFocus: false,
      focusable: true
    };
  },

  computed: {
    navStyle() {
      if (this.isCenter) return {display: 'flex', 'justify-content': 'center'}
      const dir = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'X' : 'Y';
      return {
        transform: `translate${dir}(-${this.navOffset}px)`
      };
    },
    sizeName() {
      return ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
    }
  },

  methods: {
    scrollPrev() {
      const containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
      const currentOffset = this.navOffset;

      if (!currentOffset) return;

      let newOffset = currentOffset > containerSize
        ? currentOffset - containerSize
        : 0;

      this.navOffset = newOffset;
    },
    scrollNext() {
      const navSize = this.$refs.nav[`offset${firstUpperCase(this.sizeName)}`];
      const containerSize = this.$refs.navScroll[`offset${firstUpperCase(this.sizeName)}`];
      const currentOffset = this.navOffset;

      if (navSize - currentOffset <= containerSize) return;

      let newOffset = navSize - currentOffset > containerSize * 2
        ? currentOffset + containerSize
        : (navSize - containerSize);

      this.navOffset = newOffset;
    },
    scrollToActiveTab() {
      if (!this.scrollable) return;
      const nav = this.$refs.nav;
      const activeTab = this.$el.querySelector('.is-active');
      if (!activeTab) return;
      const navScroll = this.$refs.navScroll;
      const activeTabBounding = activeTab.getBoundingClientRect();
      const navScrollBounding = navScroll.getBoundingClientRect();
      const navBounding = nav.getBoundingClientRect();
      const currentOffset = this.navOffset;
      let newOffset = currentOffset;

      if (activeTabBounding.left < navScrollBounding.left) {
        newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
      }
      if (activeTabBounding.right > navScrollBounding.right) {
        newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
      }
      if (navBounding.right < navScrollBounding.right) {
        newOffset = nav.offsetWidth - navScrollBounding.width;
      }
      this.navOffset = Math.max(newOffset, 0);
    },
    update() {
      if (!this.$refs.nav) return;
      const sizeName = this.sizeName;
      const navSize = this.$refs.nav[`offset${firstUpperCase(sizeName)}`];
      const containerSize = this.$refs.navScroll[`offset${firstUpperCase(sizeName)}`];
      const currentOffset = this.navOffset;

      if (containerSize < navSize) {
        const currentOffset = this.navOffset;
        this.scrollable = this.scrollable || {};
        this.scrollable.prev = currentOffset;
        this.scrollable.next = currentOffset + containerSize < navSize;
        if (navSize - currentOffset < containerSize) {
          this.navOffset = navSize - containerSize;
        }
      } else {
        this.scrollable = false;
        if (currentOffset > 0) {
          this.navOffset = 0;
        }
      }
    },
    changeTab(e) {
      e.preventDefault();
      const keyCode = e.keyCode;
      let nextIndex;
      let currentIndex, tabList;
      if ([37, 38, 39, 40].indexOf(keyCode) !== -1) { // 左右上下键更换tab
        tabList = e.currentTarget.querySelectorAll('[role=tab]');
        currentIndex = Array.prototype.indexOf.call(tabList, e.target);
      } else {
        return;
      }
      if (keyCode === 37 || keyCode === 38) { // left
        if (currentIndex === 0) { // first
          nextIndex = tabList.length - 1;
        } else {
          nextIndex = currentIndex - 1;
        }
      } else { // right
        if (currentIndex < tabList.length - 1) { // not last
          nextIndex = currentIndex + 1;
        } else {
          nextIndex = 0;
        }
      }
      tabList[nextIndex].focus(); // 改变焦点元素
      tabList[nextIndex].click(); // 选中下一个tab
      this.setFocus();
    },
    setFocus() {
      if (this.focusable) {
        this.isFocus = true;
      }
    },
    removeFocus() {
      this.isFocus = false;
    },
    visibilityChangeHandler() {
      const visibility = document.visibilityState;
      if (visibility === 'hidden') {
        this.focusable = false;
      } else if (visibility === 'visible') {
        setTimeout(() => {
          this.focusable = true;
        }, 50);
      }
    },
    windowBlurHandler() {
      this.focusable = false;
    },
    windowFocusHandler() {
      setTimeout(() => {
        this.focusable = true;
      }, 50);
    }
  },

  updated() {
    this.update();
  },

  render(h) {
    const {
      type,
      panes,
      editable,
      onTabClick,
      onTabRemove,
      navStyle,
      scrollable,
      scrollNext,
      scrollPrev,
      changeTab,
      setFocus,
      removeFocus,
      isCenter,
      closeIcon,
      closeIconClass,
      headerHeight
    } = this;
    const itemStyle = {
      height: headerHeight,
      lineHeight: headerHeight
    }

    const scrollBtn = scrollable
      ? [
        <span class={['rumo-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled']} style={itemStyle} on-click={scrollPrev}><i class="rumo-icons icon-left-line"></i></span>,
        <span class={['rumo-tabs__nav-next', scrollable.next ? '' : 'is-disabled']} style={itemStyle} on-click={scrollNext}><i class="rumo-icons icon-right-line"></i></span>
      ] : null;

    const tabs = this._l(panes, (pane, index) => {
      let tabName = pane.name || pane.index || index;
      const closable = pane.isClosable || editable;

      pane.index = `${index}`;

      const btnClose = closable
        ? <span class={{'rumo-icons close-button': true, [closeIcon ? closeIcon: 'icon-close']: true, [closeIconClass]: closeIconClass }} on-click={(ev) => { onTabRemove(pane, ev); }}></span>
        : null;

      const tabLabelContent = pane.$slots.label || pane.label;
      const tabindex = pane.active ? 0 : -1;

      return (
        <div
          class={{
            'rumo-tabs__item': true,
            [`is-${this.rootTabs.tabPosition}`]: true,
            'is-active': pane.active,
            'is-disabled': pane.disabled,
            'is-closable': closable,
            'is-focus': this.isFocus
          }}
          style={itemStyle}
          id={`tab-${tabName}`}
          aria-controls={`pane-${tabName}`}
          role="tab"
          aria-selected={pane.active}
          ref="tabs"
          tabindex={tabindex}
          refInFor
          on-focus={() => { setFocus(); }}
          on-blur={() => { removeFocus(); }}
          on-click={(ev) => { removeFocus(); onTabClick(pane, tabName, ev); }}
          on-keydown={(ev) => { if (closable && (ev.keyCode === 46 || ev.keyCode === 8)) { onTabRemove(pane, ev); } }}
        >
          {tabLabelContent}
          {btnClose}
        </div>
      );
    });
    return (
      <div class={['rumo-tabs__nav-wrap', scrollable ? 'is-scrollable' : '', `is-${this.rootTabs.tabPosition}`]}>
        {scrollBtn}
        <div class={['rumo-tabs__nav-scroll']} ref="navScroll" style={isCenter ? navStyle : ''}>
          <div class="rumo-tabs__nav" ref="nav" style={!isCenter ? navStyle : ''} role="tablist" on-keydown={changeTab}>
            {!type ? <tab-bar tabs={panes}></tab-bar> : null}
            {tabs}
          </div>
        </div>
      </div>
    );
  },

  mounted() {
    addResizeListener(this.$el, this.update);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    window.addEventListener('blur', this.windowBlurHandler);
    window.addEventListener('focus', this.windowFocusHandler);
  },

  beforeDestroy() {
    if (this.$el && this.update) removeResizeListener(this.$el, this.update);
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    window.removeEventListener('blur', this.windowBlurHandler);
    window.removeEventListener('focus', this.windowFocusHandler);
  }
};
</script>

