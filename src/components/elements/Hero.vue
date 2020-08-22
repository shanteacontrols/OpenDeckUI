<template>
  <div
    class="flex justify-center items-center surface-elevated border-b text-center"
    :class="custom"
  >
    <slot name="default">
      <h3 class="max-w-sm mx-auto flex-1 align-middle">
        {{ title }}
      </h3>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Hero",
  props: {
    title: {
      type: String,
      default: null,
    },
    custom: {
      type: String,
      default: "",
    },
  },
});
</script>
