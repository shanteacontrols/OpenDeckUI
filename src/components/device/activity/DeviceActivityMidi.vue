<template>
  <div class="p-2 border-b border-gray-800 last:border-b-0">
    <strong class="me-2">
      <span v-if="MidiRealtimeEvent.includes(logEntry.eventType)"
        >Real time:</span
      >
      {{ MidiEventTypeLabel[logEntry.eventType] }}
    </strong>
    <div v-if="logEntry.value" class="mr-2">Value: {{ logEntry.value }}</div>
    <div v-if="logEntry.channel" class="mr-2">
      Channel: {{ logEntry.channel }}
    </div>
    <div v-if="logEntry.controller && logEntry.controller.number" class="mr-2">
      controller: {{ logEntry.controller.number }}
    </div>
    <div v-if="logEntry.data && logEntry.data.length > 2" class="mr-2">
      Velocity: {{ logEntry.data[2] }}
    </div>
    <div v-if="logEntry.data && logEntry.data.length" class="mr-2">
      Raw data: {{ logEntry.data }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate } from "../../../util";
import { Block } from "../../../definitions";
import {
  ILogEntryMidi,
  MidiEventTypeLabel,
  MidiRealtimeEvent,
} from "../../../store/modules/activity-log";

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
      MidiEventTypeLabel,
      MidiRealtimeEvent,
    };
  },
});
</script>
