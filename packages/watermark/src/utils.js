// Derived from element-plus/packages/components/watermark/src/utils.ts (MIT) — https://github.com/element-plus/element-plus

/** converting camel-cased strings to be lowercase and link it with Separator */
export function toLowercaseSeparator(key) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function getStyleStr(style) {
  return Object.keys(style)
    .map(key => `${toLowercaseSeparator(key)}: ${style[key]};`)
    .join(' ');
}

/** Returns the ratio of the device's physical pixel resolution to the css pixel resolution */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/** Whether to re-render the watermark */
export function reRendering(mutation, watermarkElement) {
  let flag = false;
  // Whether to delete the watermark node
  if (mutation.removedNodes.length && watermarkElement) {
    const removed = mutation.removedNodes;
    for (let i = 0; i < removed.length; i++) {
      if (removed[i] === watermarkElement) {
        flag = true;
        break;
      }
    }
  }
  // Whether the watermark dom property value has been modified
  if (mutation.type === 'attributes' && mutation.target === watermarkElement) {
    flag = true;
  }
  return flag;
}
