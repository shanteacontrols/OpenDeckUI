<template>
  <div class="section" :class="{ 'section-wide': !!wide }">
    <slot name="title">
      <h3 v-if="title" class="section-heading">
        <div class="section-heading-inner">
          {{ title }}
        </div>
      </h3>
    </slot>

    <div v-if="showContent" class="section-content">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Section",
  props: {
    title: {
      type: String,
      default: null,
    },
    showContent: {
      type: Boolean,
      default: true,
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
