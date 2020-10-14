<template>
  <div class="py-2 border-b border-gray-800 last:border-b-0">
    <strong v-if="logEntry.requestId" class="text-red-500 mr-4"
      >Request {{ logEntry.requestId }}</strong
    >
    <strong v-if="logEntry.errorCode" class="text-red-500 mr-2"
      >Error Code {{ logEntry.errorCode }}</strong
    >
    <span class="text-red-500">
      {{ logEntry.message }}
      {{
        logEntry.errorCode && getErrorDefinition(logEntry.errorCode).description
      }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getErrorDefinition } from "../../definitions";
import { ILogEntryError } from "./request-log-store";

export default defineComponent({
  name: "ActivityError",
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryError,
    },
  },
  setup() {
    return {
      getErrorDefinition,
    };
  },
});
</script>
