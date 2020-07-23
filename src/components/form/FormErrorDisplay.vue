<template>
  <div class="errors">
    <div v-for="(error, idx) in errors" :key="idx">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormErrorDisplay",
  props: {
    errors: {
      required: true,
      type: Array as () => Array<string>,
    },
  },
});
</script>
