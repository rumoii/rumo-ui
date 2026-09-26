import Utils from '../aria-utils';
import Submenu from './aria-submenu';

class MenuItem {
  constructor(domNode) {
    this.domNode = domNode;
    this.submenu = null;
    this.domNode.setAttribute('tabindex', '0');
    var menuChild = this.domNode.querySelector('.rumo-menu');
    if (menuChild) {
      this.submenu = new Submenu(this, menuChild); // eslint-disable-line
    }
    this.addListeners();
  }
  addListeners() {
    let _this = this;
    const keys = Utils.keys;

    this.domNode.addEventListener('keydown', (event) => {
      let prevDef = false;

      switch (event.keyCode) {
        case keys.down:
          Utils.triggerEvent(event.currentTarget, 'mouseenter');
          _this.submenu && _this.submenu.gotoSubIndex(0);
          prevDef = true;
          break;
        case keys.up:
          Utils.triggerEvent(event.currentTarget, 'mouseenter');
          _this.submenu && _this.submenu.gotoSubIndex(_this.submenu.subMenuItems.length - 1);
          prevDef = true;
          break;
        case keys.tab:
          Utils.triggerEvent(event.currentTarget, 'mouseleave');
          break;
        case keys.enter:
        case keys.space:
          prevDef = true;
          event.currentTarget.click();
          break;
      }
      if (prevDef) {
        event.preventDefault();
      }
    });
  }
}

export default MenuItem;
