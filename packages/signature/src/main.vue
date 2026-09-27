<template>
  <div class="rumo-signature" :style="{ width: cssWidth, height: cssHeight }">
    <canvas ref="canvas" class="rumo-signature__canvas"></canvas>
  </div>
</template>
<script>
// Derived from vue-signature-pad/src/components/VueSignaturePad.vue (MIT) — https://github.com/neighborhood999/vue-signature-pad @0473c2ada300c776a139ac71c7ff6ac819160c48
// Uses signature_pad@4.2.0 (MIT) — https://github.com/szimek/signature_pad
import SignaturePad from 'signature_pad';

export default {
  name: 'RumoSignature',
  componentName: 'RumoSignature',
  props: {
    penColor: { type: String, default: '#000000' },
    bgColor: { type: String, default: 'rgba(0, 0, 0, 0)' },
    width: { type: [Number, String], default: 300 },
    height: { type: [Number, String], default: 150 },
    dotSize: { type: Number, default: 0 }
  },
  computed: {
    cssWidth() { return typeof this.width === 'number' ? this.width + 'px' : this.width; },
    cssHeight() { return typeof this.height === 'number' ? this.height + 'px' : this.height; }
  },
  watch: {
    penColor(value) { if (this.pad) this.pad.penColor = value; },
    bgColor(value) { if (this.pad) { this.pad.backgroundColor = value; this.resizeCanvas(); } },
    dotSize(value) { if (this.pad) this.pad.dotSize = value; },
    width() { this.$nextTick(this.resizeCanvas); },
    height() { this.$nextTick(this.resizeCanvas); }
  },
  mounted() {
    this.pad = new SignaturePad(this.$refs.canvas, {
      penColor: this.penColor,
      backgroundColor: this.bgColor,
      dotSize: this.dotSize
    });
    this.beginHandler = event => this.$emit('onBegin', event.detail);
    this.endHandler = event => this.$emit('onEnd', event.detail);
    this.pad.addEventListener('beginStroke', this.beginHandler);
    this.pad.addEventListener('endStroke', this.endHandler);
    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas);
    if (this.pad) {
      this.pad.removeEventListener('beginStroke', this.beginHandler);
      this.pad.removeEventListener('endStroke', this.endHandler);
      this.pad.off();
      this.pad = null;
    }
  },
  methods: {
    resizeCanvas() {
      if (!this.pad || !this.$refs.canvas) return;
      const canvas = this.$refs.canvas;
      const strokes = this.pad.toData();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * ratio));
      canvas.getContext('2d').scale(ratio, ratio);
      this.pad.clear();
      if (strokes.length) this.pad.fromData(strokes);
    },
    save() { return this.pad ? this.pad.toDataURL('image/png') : ''; },
    clear() { if (this.pad) this.pad.clear(); },
    undo() {
      if (!this.pad) return;
      const strokes = this.pad.toData();
      if (strokes.length) this.pad.fromData(strokes.slice(0, -1));
    }
  }
};
</script>
