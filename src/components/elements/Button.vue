<template>
  <button :disabled="disabled" class="btn">
    <slot name="default"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Button",
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
  },
});
</script>
