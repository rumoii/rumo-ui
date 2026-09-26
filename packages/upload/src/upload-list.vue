<template>
  <transition-group tag="ul"
    :class="[
      'rumo-upload-list',
      'rumo-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="rumo-list">
    <li v-for="file in files"
      :class="['rumo-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false">
      <img class="rumo-upload-list__item-thumbnail"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url"
        alt="">
      <a class="rumo-upload-list__item-name"
        @click="handleClick(file)">
        <i class="rumo-icons icon-report"></i>{{file.name}}
      </a>
      <label class="rumo-upload-list__item-status-label">
        <i :class="{
          'rumo-icon-upload-success': true,
          'icon-check-circle': listType === 'text',
          'icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"
          class="rumo-icons"></i>
      </label>
      <i class="rumo-icons icon-close"
        v-if="!disabled"
        @click="$emit('remove', file)"></i>
      <i class="rumo-icon-close-tip"
        v-if="!disabled">{{ t('rumo.upload.deleteTip') }}</i>
      <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
      <rumo-progress v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :percentage="parsePercentage(file.percentage)">
      </rumo-progress>
      <span class="rumo-upload-list__item-actions"
        v-if="listType === 'picture-card'">
        <span class="rumo-upload-list__item-preview"
          v-if="handlePreview && listType === 'picture-card'"
          @click="handlePreview(file)">
          <i class="rumo-icons icon-zoom-in"></i>
        </span>
        <span v-if="!disabled"
          class="rumo-upload-list__item-delete"
          @click="$emit('remove', file)">
          <i class="rumo-icons icon-trash-full"></i>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
import Locale from 'rumo-ui/src/mixins/locale';
import RumoProgress from 'rumo-ui/packages/progress';

export default {
  mixins: [Locale],

  data() {
    return {
      focusing: false
    };
  },
  components: { RumoProgress },

  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val);
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    }
  }
};
</script>
