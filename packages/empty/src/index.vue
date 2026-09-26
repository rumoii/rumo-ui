<template>
  <div class="rumo-empty">
    <div class="rumo-empty__image" :style="imageStyle">
      <img v-if="image" :src="image" ondragstart="return false">
      <slot v-else name="image">
        <img-empty />
      </slot>
    </div>
    <div v-if="description || $slots.description" class="rumo-empty__description">
      <slot v-if="$slots.description" name="description"></slot>
      <p v-else>{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="rumo-empty__bottom">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import ImgEmpty from './img-empty.vue';
import { t } from 'rumo-ui/src/locale';
export default {
  name: 'RumoEmpty',
  components: {
    [ImgEmpty.name]: ImgEmpty
  },
  props: {
    image: {
      type: String,
      default: ''
    },
    imageSize: {
      type: Number,
      default: 120
    },
    description: {
      type: String,
      default: ''
    }
  },
  computed: {
    imageStyle() {
      return {
        width: this.imageSize ? `${this.imageSize}px` : ''
      };
    }
  }
};
</script>
