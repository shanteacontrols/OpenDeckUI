<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path
      v-if="type === 'right'"
      d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"
    />
    <path
      v-else
      d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Chevron",
  props: {
    type: {
      type: String,
      default: "left",
      validate: (val: string) => ["left", "right"].includes(val),
    },
  },
});
</script>
