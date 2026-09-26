'use strict';
import Menuitem from './aria-menuitem';

class Menu {
  constructor(domNode) {
    this.domNode = domNode;
    let menuChildren = this.domNode.childNodes;
    let arr = [];
    arr.filter.call(menuChildren, (child) => {
      return child.nodeType === 1;
    }).forEach((child) => {
      new Menuitem(child) // eslint-disable-line
    });
  }
}

export default Menu;
