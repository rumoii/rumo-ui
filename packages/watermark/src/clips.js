// Derived from element-plus/packages/components/watermark/src/useClips.ts (MIT) — https://github.com/element-plus/element-plus

// [alignRatio, spaceRatio]
const TEXT_ALIGN_RATIO_MAP = {
  left: [0, 0.5],
  start: [0, 0.5],
  center: [0.5, 0],
  right: [1, -0.5],
  end: [1, -0.5]
};

function prepareCanvas(width, height, ratio) {
  ratio = ratio || 1;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const realWidth = width * ratio;
  const realHeight = height * ratio;
  canvas.setAttribute('width', `${realWidth}px`);
  canvas.setAttribute('height', `${realHeight}px`);
  ctx.save();
  return { ctx, canvas, realWidth, realHeight };
}

/**
 * Get the clips of text content (data URL + logical size).
 * content: string | string[] | HTMLImageElement
 */
export default function getClips(content, rotate, ratio, width, height, font, gapX, gapY, space) {
  // ================= Text / Image =================
  const prepared = prepareCanvas(width, height, ratio);
  const ctx = prepared.ctx;
  const canvas = prepared.canvas;
  const contentWidth = prepared.realWidth;
  const contentHeight = prepared.realHeight;
  let baselineOffset = 0;

  if (content instanceof HTMLImageElement) {
    // Image
    ctx.drawImage(content, 0, 0, contentWidth, contentHeight);
  } else {
    // Text
    const color = font.color;
    const fontSize = font.fontSize;
    const fontStyle = font.fontStyle;
    const fontWeight = font.fontWeight;
    const fontFamily = font.fontFamily;
    const textAlign = font.textAlign;
    const textBaseline = font.textBaseline;
    const mergedFontSize = Number(fontSize) * ratio;

    ctx.font = `${fontStyle} normal ${fontWeight} ${mergedFontSize}px/${height}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    const contents = Array.isArray(content) ? content : [content];
    if (textBaseline !== 'top' && contents[0]) {
      const argumentMetrics = ctx.measureText(contents[0]);
      ctx.textBaseline = 'top';
      const topMetrics = ctx.measureText(contents[0]);
      baselineOffset = argumentMetrics.actualBoundingBoxAscent - topMetrics.actualBoundingBoxAscent;
    }
    contents.forEach((item, index) => {
      const ratioPair = TEXT_ALIGN_RATIO_MAP[textAlign] || TEXT_ALIGN_RATIO_MAP.center;
      const alignRatio = ratioPair[0];
      const spaceRatio = ratioPair[1];
      ctx.fillText(
        item == null ? '' : item,
        contentWidth * alignRatio + space * spaceRatio,
        index * (mergedFontSize + font.fontGap * ratio)
      );
    });
  }

  // ==================== Rotate ====================
  const angle = (Math.PI / 180) * Number(rotate);
  const maxSize = Math.max(width, height);
  const rotated = prepareCanvas(maxSize, maxSize, ratio);
  const rCtx = rotated.ctx;
  const rCanvas = rotated.canvas;
  const realMaxSize = rotated.realWidth;

  // Copy from `ctx` and rotate
  rCtx.translate(realMaxSize / 2, realMaxSize / 2);
  rCtx.rotate(angle);
  if (contentWidth > 0 && contentHeight > 0) {
    rCtx.drawImage(canvas, -contentWidth / 2, -contentHeight / 2);
  }

  // Get boundary of rotated text
  function getRotatePos(x, y) {
    const targetX = x * Math.cos(angle) - y * Math.sin(angle);
    const targetY = x * Math.sin(angle) + y * Math.cos(angle);
    return [targetX, targetY];
  }

  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;

  const halfWidth = contentWidth / 2;
  const halfHeight = contentHeight / 2;
  const points = [
    [0 - halfWidth, 0 - halfHeight],
    [0 + halfWidth, 0 - halfHeight],
    [0 + halfWidth, 0 + halfHeight],
    [0 - halfWidth, 0 + halfHeight]
  ];
  points.forEach(point => {
    const pos = getRotatePos(point[0], point[1]);
    left = Math.min(left, pos[0]);
    right = Math.max(right, pos[0]);
    top = Math.min(top, pos[1]);
    bottom = Math.max(bottom, pos[1]);
  });

  const cutLeft = left + realMaxSize / 2;
  const cutTop = top + realMaxSize / 2;
  const cutWidth = right - left;
  const cutHeight = bottom - top;

  // ================ Fill Alternate ================
  const realGapX = gapX * ratio;
  const realGapY = gapY * ratio;
  const filledWidth = (cutWidth + realGapX) * 2;
  const filledHeight = cutHeight + realGapY;

  const filled = prepareCanvas(filledWidth, filledHeight);
  const fCtx = filled.ctx;
  const fCanvas = filled.canvas;

  function drawImg(targetX, targetY) {
    fCtx.drawImage(
      rCanvas,
      cutLeft,
      cutTop,
      cutWidth,
      cutHeight,
      targetX || 0,
      (targetY || 0) + baselineOffset,
      cutWidth,
      cutHeight
    );
  }
  drawImg();
  drawImg(cutWidth + realGapX, -cutHeight / 2 - realGapY / 2);
  drawImg(cutWidth + realGapX, +cutHeight / 2 + realGapY / 2);

  return [fCanvas.toDataURL(), filledWidth / ratio, filledHeight / ratio];
}
