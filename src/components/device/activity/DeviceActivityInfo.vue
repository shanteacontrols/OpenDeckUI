<template>
  <p class="p-2 border-b border-gray-800 last:border-b-0">
    <span class="mr-2"> {{ formatDate(logEntry.time) }} </span>
    <strong>
      <span class="mr-2">
        {{ logEntry }}
      </span>
    </strong>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ILogEntryInfo } from "../../../store/modules/activity-log";
import { formatDate } from "../../../util";
import { Block } from "../../../definitions";

export default defineComponent({
  name: "DeviceActivityInfo",
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryInfo,
    },
  },
  setup() {
    return {
      Block,
      formatDate,
    };
  },
});
</script>
