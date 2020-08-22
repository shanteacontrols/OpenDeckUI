<template>
  <div class="absolute flex inset-0 opacity-75 bg-gray-900">
    <Spinner class="self-center" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SpinnerOverlay",
});
</script>
