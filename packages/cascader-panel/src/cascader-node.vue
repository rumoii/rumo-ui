<script>
  import RumoCheckbox from 'rumo-ui/packages/checkbox';
  import RumoRadio from 'rumo-ui/packages/radio';
  import { isEqual } from 'rumo-ui/src/utils/util';
  import { isDefined } from 'rumo-ui/src/utils/types';

  const stopPropagation = e => e.stopPropagation();

  export default {
    inject: ['panel'],

    components: {
      RumoCheckbox,
      RumoRadio
    },

    props: {
      node: {
        required: true
      },
      nodeId: String
    },

    data() {
      return {
        isShowCheckBox: true
      };
    },

    watch: {
      'node.refreshFlag'(val) {
        this.isShowCheckBox = false;
        this.$nextTick(() => {
          this.isShowCheckBox = true;
        });
      }
    },

    computed: {
      config() {
        return this.panel.config;
      },
      isLeaf() {
        return this.node.isLeaf;
      },
      isDisabled() {
        return this.node.isDisabled;
      },
      checkedValue() {
        return this.panel.checkedValue;
      },
      isChecked() {
        let config = this.panel.config;
        if (config.virtualScroll) {
          return true && this.panel.checkedValueObj[this.node.getValue()];
        } else {
          return this.node.isSameNode(this.checkedValue);
        }
      },
      inActivePath() {
        let inActivePath = this.isInPath(this.panel.activePath);
        this.node.inActivePath = inActivePath;
        return inActivePath;
      },
      inCheckedPath() {
        if (!this.config.checkStrictly) return false;

        return this.panel.checkedNodePaths
          .some(checkedPath => this.isInPath(checkedPath));
      },
      value() {
        return this.node.getValueByOption();
      }
    },

    methods: {
      handleExpand() {
        const { panel, node, isDisabled, config } = this;
        const { multiple, checkStrictly } = config;

        if (!checkStrictly && isDisabled || node.loading) return;

        if (config.lazy && !node.loaded) {
          panel.lazyLoad(node, () => {
            // do not use cached leaf value here, invoke this.isLeaf to get new value.
            const { isLeaf } = this;

            if (!isLeaf) this.handleExpand();
            if (multiple) {
              // if leaf sync checked state, else clear checked state
              const checked = isLeaf ? node.checked : false;
              this.handleMultiCheckChange(checked);
            }
          });
        } else {
          panel.handleExpand(node);
        }
      },

      handleCheckChange() {
        const { panel, value, node } = this;
        panel.handleCheckChange(value);
        panel.handleExpand(node);
      },

      handleMultiCheckChange(checked) {
        // this.node.doCheck(checked);
        this.node.doCheck(checked, false, true);
        this.panel.calculateMultiCheckedValue();
      },

      isInPath(pathNodes) {
        const { node } = this;
        const selectedPathNode = pathNodes[node.level - 1] || {};
        return selectedPathNode.uid === node.uid;
      },

      renderPrefix(h) {
        const { isLeaf, isChecked, config } = this;
        const { checkStrictly, multiple } = config;

        // 如果checkStrictly模式下如果不选择radio， 那么可以不管是否leaf都可以显示打勾icon，否则只有leaf节点才显示打勾icon
        let showCheckIcon = false
        const isShowRadio = isDefined(config.isShowRadio) ? config.isShowRadio : true
        if (checkStrictly && !isShowRadio && isChecked) {
          showCheckIcon = true
        } else if (!checkStrictly && isLeaf && isChecked) {
          showCheckIcon = true
        }

        if (multiple) {
          return this.renderCheckbox(h);
        } else if (checkStrictly && isShowRadio) {
          return this.renderRadio(h);
        } else if (showCheckIcon) {
          return this.renderCheckIcon(h);
        }

        return null;
      },

      renderPostfix(h) {
        const { node, isLeaf } = this;

        if (node.loading) {
          return this.renderLoadingIcon(h);
        } else if (!isLeaf) {
          return this.renderExpandIcon(h);
        }

        return null;
      },

      renderCheckbox(h) {
        const { node, config, isDisabled } = this;
        const events = {
          on: { change: this.handleMultiCheckChange },
          nativeOn: {}
        };

        if (config.checkStrictly) { // when every node is selectable, click event should not trigger expand event.
          events.nativeOn.click = stopPropagation;
        }

        return (
          <rumo-checkbox
            value={ node.checked }
            indeterminate={ node.indeterminate }
            disabled={ isDisabled }
            { ...events }
          ></rumo-checkbox>
        );
      },

      renderRadio(h) {
        let { checkedValue, value, isDisabled } = this;

        // to keep same reference if value cause radio's checked state is calculated by reference comparision;
        if (isEqual(value, checkedValue)) {
          value = checkedValue;
        }

        return (
          <rumo-radio
            value={ checkedValue }
            label={ value }
            disabled={ isDisabled }
            onChange={ this.handleCheckChange }
            nativeOnClick={ stopPropagation }>
            {/* add an empty element to avoid render label */}
            <span></span>
          </rumo-radio>
        );
      },

      renderCheckIcon(h) {
        return (
          <i class="rumo-icons icon-check rumo-icons-14 rumo-cascader-node__prefix"></i>
        );
      },
      renderLoadingIcon(h) {
        return (
          <i class="rumo-icons icon-refresh rumo-icons-spin rumo-icons-14 rumo-cascader-node__postfix"></i>
        );
      },
      renderExpandIcon(h) {
        return (
          <i class="rumo-icons icon-right-line rumo-icons-14 rumo-cascader-node__postfix"></i>
        );
      },
      renderContent(h) {
        const { panel, node } = this;
        const render = panel.renderLabelFn;
        const vnode = render
          ? render({ node, data: node.data })
          : null;

        return (
          <span class="rumo-cascader-node__label">{ vnode || node.label }</span>
        );
      }
    },

    render(h) {
      const {
        inActivePath,
        inCheckedPath,
        isChecked,
        isLeaf,
        isDisabled,
        config,
        nodeId,
        isShowCheckBox
      } = this;
      const { expandTrigger, checkStrictly, multiple } = config;
      const disabled = !checkStrictly && isDisabled;
      const events = { on: {} };

      // 如果checkStrictly模式下如果不选择radio， 那么可以不管是否leaf都可以点击，否则只有leaf节点才可以点击
      let canCheckNode = false
      const isShowRadio = isDefined(config.isShowRadio) ? config.isShowRadio : true
      if (checkStrictly && !isShowRadio) {
        canCheckNode = true
      } else if (!checkStrictly && isLeaf) {
        canCheckNode = true
      }

      if (expandTrigger === 'click') {
        events.on.click = this.handleExpand;
      } else {
        events.on.mouseenter = e => {
          this.handleExpand();
          this.$emit('expand', e);
        };
        events.on.focus = e => {
          this.handleExpand();
          this.$emit('expand', e);
        };
      }
      if (canCheckNode && !isDisabled && !multiple) {
        events.on.click = this.handleCheckChange;
      }

      return (
        <li
          role="menuitem"
          id={ nodeId }
          aria-expanded={ inActivePath }
          tabindex={ disabled ? null : -1 }
          class={{
            'rumo-cascader-node': true,
            'is-selectable': checkStrictly,
            'in-active-path': inActivePath,
            'in-checked-path': inCheckedPath,
            'is-active': isChecked,
            'is-disabled': disabled
          }}
          {...events}>
          { isShowCheckBox && this.renderPrefix(h) }
          { this.renderContent(h) }
          { this.renderPostfix(h) }
        </li>
      );
    }
  };
</script>
