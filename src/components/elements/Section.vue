<template>
  <div class="section w-ful" :class="`${section}`">
    <Heading v-if="title" preset="section-title" :class="`${sectionTitle}`">
      {{ title }}
    </Heading>

    <div class="section-content" :class="`${sectionContent}`">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "Section",
  props: {
    title: String,
  },
  setup() {
    return {
      ...defaultTheme,
    };
  },
});
</script>
