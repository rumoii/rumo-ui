<template>
  <canvas ref="canvas" class="rumo-qr" :width="size" :height="size"></canvas>
</template>
<script>
// Uses qrcode@1.5.4 (MIT) — https://github.com/soldair/node-qrcode
import QRCode from 'qrcode';

export default {
  name: 'RumoQr',
  componentName: 'RumoQr',
  props: {
    text: { type: String, default: '' },
    size: { type: Number, default: 200 },
    margin: { type: Number, default: 4 },
    ecLevel: { type: String, default: 'M', validator: value => ['L', 'M', 'Q', 'H'].indexOf(value) >= 0 },
    color: { type: Object, default: () => ({ dark: '#000000', light: '#ffffff' }) },
    logo: { type: String, default: '' }
  },
  computed: {
    renderKey() {
      return JSON.stringify([this.text, this.size, this.margin, this.ecLevel,
        this.color.dark, this.color.light, this.logo]);
    }
  },
  watch: {
    renderKey() { this.renderQr(); }
  },
  mounted() { this.renderQr(); },
  beforeDestroy() {
    this.disposed = true;
    this.renderVersion = (this.renderVersion || 0) + 1;
    this.releaseImage();
  },
  methods: {
    releaseImage() {
      if (!this.pendingImage) return;
      this.pendingImage.onload = null;
      this.pendingImage.onerror = null;
      this.pendingImage = null;
    },
    renderQr() {
      if (this.disposed || !this.$refs.canvas) return;
      const version = this.renderVersion = (this.renderVersion || 0) + 1;
      this.releaseImage();
      const canvas = this.$refs.canvas;
      const options = {
        width: this.size,
        margin: this.margin,
        errorCorrectionLevel: this.ecLevel,
        color: { dark: this.color.dark || '#000000', light: this.color.light || '#ffffff' }
      };
      const isCurrent = () => !this.disposed && version === this.renderVersion;
      const fail = error => { if (isCurrent()) this.$emit('error', error); };
      if (!this.logo) {
        QRCode.toDataURL(canvas, this.text, options).then(dataUrl => {
          if (isCurrent()) this.$emit('load', dataUrl);
        }).catch(fail);
        return;
      }
      QRCode.toCanvas(canvas, this.text, options).then(() => {
        if (!isCurrent()) return;
        const image = new Image();
        this.pendingImage = image;
        image.onload = () => {
          if (!isCurrent()) return;
          this.pendingImage = null;
          try {
            const side = canvas.width * 0.22;
            const x = (canvas.width - side) / 2;
            const context = canvas.getContext('2d');
            context.fillStyle = options.color.light;
            context.fillRect(x - 3, x - 3, side + 6, side + 6);
            context.drawImage(image, x, x, side, side);
            this.$emit('load', canvas.toDataURL('image/png'));
          } catch (error) { fail(error); }
        };
        image.onerror = () => {
          this.pendingImage = null;
          fail(new Error('QR logo could not be loaded'));
        };
        image.crossOrigin = 'anonymous';
        image.src = this.logo;
      }).catch(fail);
    }
  }
};
</script>
