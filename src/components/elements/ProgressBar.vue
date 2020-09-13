<template>
  <div class="absolute flex inset-0 bg-gray-900">
    <div
      class="flex-1 rounded h-6 top-auto self-center opacity-100 justify-center mx-auto max-w-sm bg-gray-600"
    >
      <div
        class="flex-1 h-6 text-xs rounded text-center bg-yellow-500 text-gray-800 leading-6"
        :style="{ width: `${percentage}%` }"
      >
        {{ percentage }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProgressBar",
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
  },
});
</script>
