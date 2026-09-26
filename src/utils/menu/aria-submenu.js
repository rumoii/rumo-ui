'use strict';
import Utils from '../aria-utils';

class SubMenu {
  constructor(parent, domNode) {
    this.domNode = domNode;
    this.parent = parent;
    this.subMenuItems = [];
    this.subIndex = 0;
    this.subMenuItems = this.domNode.querySelectorAll('li');
    this.addListeners();
  }
  gotoSubIndex(idx) {
    if (idx === this.subMenuItems.length) {
      idx = 0;
    } else if (idx < 0) {
      idx = this.subMenuItems.length - 1;
    }
    this.subMenuItems[idx].focus();
    this.subIndex = idx;
  }
  addListeners() {
    let _this = this;
    const keys = Utils.keys;

    let parentNode = this.parent.domNode;
    Array.prototype.forEach.call(this.subMenuItems, (el) => {
      el.addEventListener('keydown', (event) => {
        var prevDef = false;
        switch (event.keyCode) {
          case keys.down:
            _this.gotoSubIndex(_this.subIndex + 1);
            prevDef = true;
            break;
          case keys.up:
            _this.gotoSubIndex(_this.subIndex - 1);
            prevDef = true;
            break;
          case keys.tab:
            Utils.triggerEvent(parentNode, 'mouseleave');
            break;
          case keys.enter:
          case keys.space:
            prevDef = true;
            event.currentTarget.click();
            break;
        }
        if (prevDef) {
          event.preventDefault();
          event.stopPropagation();
        }
        return false;
      });
    });
  }
}

export default SubMenu;
