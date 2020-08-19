<template>
  <button
    :disabled="disabled"
    class="my-3 py-2 px-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-full font-bold text-sm focus:outline-none focus:shadow-outline"
  >
    <slot name="default"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "Button",
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  setup() {
    return {
      ...defaultTheme,
    };
  },
});
</script>
