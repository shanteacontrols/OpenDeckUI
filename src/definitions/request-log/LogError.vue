<template>
  <div class="p-2 border-b border-gray-800 last:border-b-0">
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
import { RequestState } from "../interface";
import { Block, getErrorDefinition } from "../../definitions";
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
      RequestState,
      Block,
      getErrorDefinition,
    };
  },
});
</script>
