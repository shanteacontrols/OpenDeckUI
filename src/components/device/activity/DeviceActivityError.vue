<template>
  <div class="p-2 border-b border-gray-800 last:border-b-0">
    <span class="text-red-500">
      {{ logEntry.message }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RequestState } from "../../../store/modules/device/device-promise-qeueue";
import { Block } from "../../../definitions";
import { ILogEntryError } from "../../../store/modules/activity-log";

export default defineComponent({
  name: "DeviceActivityError",
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
    };
  },
});
</script>
