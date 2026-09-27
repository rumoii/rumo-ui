<template>
  <div ref="container" class="rumo-watermark" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script>
// Derived from element-plus/packages/components/watermark/src/{watermark.vue,watermark.ts,useClips.ts,utils.ts} (MIT) — https://github.com/element-plus/element-plus
import { getPixelRatio, getStyleStr, reRendering } from './utils';
import getClips from './clips';

export default {
  name: 'RumoWatermark',

  props: {
    zIndex: {
      type: Number,
      default: 9
    },
    rotate: {
      type: Number,
      default: -22
    },
    width: Number,
    height: Number,
    image: String,
    content: {
      type: [String, Array],
      default: 'rumo-ui'
    },
    font: {
      type: Object,
      default: () => ({})
    },
    gap: {
      type: Array,
      default: () => [100, 100]
    },
    offset: Array
  },

  data() {
    return {
      watermarkEl: null,
      stopObservation: false,
      observer: null
    };
  },

  computed: {
    containerStyle() {
      return {
        position: 'relative'
      };
    },
    fontGap() {
      return this.font.fontGap != null ? this.font.fontGap : 3;
    },
    fontColor() {
      return this.font.color != null ? this.font.color : 'rgba(0,0,0,.15)';
    },
    fontSize() {
      return this.font.fontSize != null ? this.font.fontSize : 16;
    },
    fontWeight() {
      return this.font.fontWeight != null ? this.font.fontWeight : 'normal';
    },
    fontStyle() {
      return this.font.fontStyle != null ? this.font.fontStyle : 'normal';
    },
    fontFamily() {
      return this.font.fontFamily != null ? this.font.fontFamily : 'sans-serif';
    },
    textAlign() {
      return this.font.textAlign != null ? this.font.textAlign : 'center';
    },
    textBaseline() {
      return this.font.textBaseline != null ? this.font.textBaseline : 'hanging';
    },
    gapX() {
      return this.gap[0] != null ? this.gap[0] : 100;
    },
    gapY() {
      return this.gap[1] != null ? this.gap[1] : 100;
    },
    offsetLeft() {
      return this.offset && this.offset[0] != null ? this.offset[0] : this.gapX / 2;
    },
    offsetTop() {
      return this.offset && this.offset[1] != null ? this.offset[1] : this.gapY / 2;
    },
    propsSignature() {
      return JSON.stringify({
        zIndex: this.zIndex,
        rotate: this.rotate,
        width: this.width,
        height: this.height,
        image: this.image,
        content: this.content,
        font: this.font,
        gap: this.gap,
        offset: this.offset
      });
    }
  },

  watch: {
    propsSignature() {
      this.renderWatermark();
    }
  },

  mounted() {
    this.renderWatermark();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(this.onMutate);
      this.observer.observe(this.$refs.container, {
        attributes: true,
        subtree: true,
        childList: true
      });
    }
  },

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.destroyWatermark();
  },

  methods: {
    getMarkStyle() {
      const markStyle = {
        zIndex: this.zIndex,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat'
      };

      /** Calculate the style of the offset */
      let positionLeft = this.offsetLeft - this.gapX / 2;
      let positionTop = this.offsetTop - this.gapY / 2;
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`;
        markStyle.width = `calc(100% - ${positionLeft}px)`;
        positionLeft = 0;
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`;
        markStyle.height = `calc(100% - ${positionTop}px)`;
        positionTop = 0;
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

      return markStyle;
    },
    destroyWatermark() {
      if (this.watermarkEl) {
        if (this.watermarkEl.parentNode) {
          this.watermarkEl.parentNode.removeChild(this.watermarkEl);
        }
        this.watermarkEl = null;
      }
    },
    appendWatermark(base64Url, markWidth) {
      const container = this.$refs.container;
      if (container && this.watermarkEl) {
        this.stopObservation = true;
        this.watermarkEl.setAttribute('style', getStyleStr(Object.assign(
          {},
          this.getMarkStyle(),
          {
            backgroundImage: `url('${base64Url}')`,
            backgroundSize: `${Math.floor(markWidth)}px`
          }
        )));
        container.appendChild(this.watermarkEl);
        setTimeout(() => {
          this.stopObservation = false;
        });
      }
    },
    /**
     * Get the width and height of the watermark. The default values are as follows
     * Image: [120, 64]; Content: It's calculated by content;
     */
    getMarkSize(ctx) {
      let defaultWidth = 120;
      let defaultHeight = 64;
      let space = 0;

      const image = this.image;
      const content = this.content;
      const width = this.width;
      const height = this.height;
      const rotate = this.rotate;

      if (!image && ctx.measureText) {
        ctx.font = `${Number(this.fontSize)}px ${this.fontFamily}`;

        const contents = Array.isArray(content) ? content : [content];
        let maxWidth = 0;
        let maxHeight = 0;

        contents.forEach(item => {
          const metrics = ctx.measureText(item == null ? '' : item);
          const fontBoundingBoxAscent = metrics.fontBoundingBoxAscent;
          const fontBoundingBoxDescent = metrics.fontBoundingBoxDescent;
          // Using `actualBoundingBoxAscent` to be compatible with lower version browsers (eg: Firefox < 116)
          const itemHeight = fontBoundingBoxAscent === undefined
            ? metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
            : fontBoundingBoxAscent + fontBoundingBoxDescent;

          if (metrics.width > maxWidth) maxWidth = Math.ceil(metrics.width);
          if (itemHeight > maxHeight) maxHeight = Math.ceil(itemHeight);
        });

        defaultWidth = maxWidth;
        defaultHeight = maxHeight * contents.length + (contents.length - 1) * this.fontGap;

        const angle = (Math.PI / 180) * Number(rotate);
        space = Math.ceil(Math.abs(Math.sin(angle) * defaultHeight) / 2);

        defaultWidth += space;
      }

      return [width != null ? width : defaultWidth, height != null ? height : defaultHeight, space];
    },
    renderWatermark() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = this.image;
      const content = this.content;
      const rotate = this.rotate;

      if (ctx) {
        if (!this.watermarkEl) {
          this.watermarkEl = document.createElement('div');
        }

        const ratio = getPixelRatio();
        const size = this.getMarkSize(ctx);
        const markWidth = size[0];
        const markHeight = size[1];
        const space = size[2];

        const drawCanvas = drawContent => {
          const clips = getClips(
            drawContent || '',
            rotate,
            ratio,
            markWidth,
            markHeight,
            {
              color: this.fontColor,
              fontSize: this.fontSize,
              fontStyle: this.fontStyle,
              fontWeight: this.fontWeight,
              fontFamily: this.fontFamily,
              fontGap: this.fontGap,
              textAlign: this.textAlign,
              textBaseline: this.textBaseline
            },
            this.gapX,
            this.gapY,
            space
          );
          this.appendWatermark(clips[0], clips[1]);
        };

        if (image) {
          const img = new Image();
          img.onload = () => {
            drawCanvas(img);
          };
          img.onerror = () => {
            drawCanvas(content);
          };
          img.crossOrigin = 'anonymous';
          img.referrerPolicy = 'no-referrer';
          img.src = image;
        } else {
          drawCanvas(content);
        }
      }
    },
    onMutate(mutations) {
      if (this.stopObservation) {
        return;
      }
      mutations.forEach(mutation => {
        if (reRendering(mutation, this.watermarkEl)) {
          this.destroyWatermark();
          this.renderWatermark();
        }
      });
    }
  }
};
</script>
