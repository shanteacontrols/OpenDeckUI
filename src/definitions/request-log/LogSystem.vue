<template>
  <div class="py-2 border-b border-gray-800 last:border-b-0">
    <strong
      class="mr-2 uppercase text-xs tracking-wide"
      :class="logEntry.source === 'device' ? 'text-blue-300' : 'text-gray-400'"
    >
      {{ logEntry.source }}
    </strong>
    <span>{{ logEntry.message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ILogEntrySystem } from "./request-log-store";

export default defineComponent({
  name: "ActivitySystem",
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntrySystem,
    },
  },
});
</script>
