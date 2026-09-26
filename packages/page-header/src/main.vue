<template>
  <div class="rumo-page-header">
    <div class="rumo-page-header__left" @click="$emit('back')">
      <i class="rumo-icons icon-back rumo-icons-16"></i>
      <div class="rumo-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="rumo-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
import { t } from 'rumo-ui/src/locale';
export default {
  name: 'RumoPageHeader',

  props: {
    title: {
      type: String,
      default() {
        return t('rumo.pageHeader.title');
      }
    },
    content: String
  }
};
</script>
