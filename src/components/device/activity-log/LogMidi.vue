<template>
  <div class="p-2 border-b border-gray-800 last:border-b-0">
    <strong class="mr-2 text-gray-400">
      <span v-if="MidiRealtimeEvent.includes(logEntry.eventType)"
        >real time:</span
      >
      {{ MidiEventTypeLabel[logEntry.eventType] }}
      <template v-if="['noteon', 'noteoff'].includes(logEntry.eventType)">
        {{ logEntry.data[1] }}
      </template>
    </strong>
    <span v-if="logEntry.channel" class="mr-2">
      channel {{ logEntry.channel }}
    </span>
    <span
      v-if="logEntry.value && logEntry.eventType !== 'controlchange'"
      class="mr-2"
    >
      value {{ logEntry.value }}
    </span>
    <span v-if="logEntry.controller && logEntry.controller.number" class="mr-2">
      controller {{ logEntry.controller.number }}
    </span>
    <span v-if="logEntry.data && logEntry.data.length > 2" class="mr-2">
      velocity {{ logEntry.data[2] }}
    </span>
    <div v-if="logEntry.data && logEntry.data.length" class="mr-2">
      Raw data: {{ logEntry.data }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  ILogEntryMidi,
  MidiEventTypeLabel,
  MidiRealtimeEvent,
} from "../../../store/modules/activity-log";

export default defineComponent({
  name: "ActivityMidi",
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryMidi,
    },
  },
  setup() {
    return {
      MidiEventTypeLabel,
      MidiRealtimeEvent,
    };
  },
});
</script>
