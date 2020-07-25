<template>
  <p class="p-2 border-b border-gray-800 last:border-b-0">
    <strong class="me-2">
      {{ logEntry.eventType }}
      <span v-if="logEntry.controller && logEntry.controller.name" class="mr-2">
        {{ logEntry.controller.name }}
      </span>
      <span
        v-if="logEntry.controller && logEntry.controller.number"
        class="mr-2"
      >
        #{{ logEntry.controller.number }}
      </span>
    </strong>
    <template v-if="logEntry.value">
      <br />
      <span class="mr-2">Value: {{ logEntry.value }} </span>
    </template>
    <template v-if="logEntry.channel">
      <br />
      <span class="mr-2"> Channel: {{ logEntry.channel }} </span>
    </template>
    <template v-if="logEntry.data">
      <br />
      <span class="mr-2"> Data: {{ logEntry.data }} </span>
    </template>
    <template v-if="logEntry.controller">
      <br />
      <span class="mr-2"> controller: {{ logEntry.controller }} </span>
    </template>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate } from "../../../util";
import { Block } from "../../../definitions";
import { ILogEntryMidi } from "../../../store/modules/activity-log";

export default defineComponent({
  name: "DeviceActivityMidi",
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryMidi,
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
