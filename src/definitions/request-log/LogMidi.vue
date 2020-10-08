<template>
  <div class="border-b border-gray-800 last:border-b-0">
    <strong class="mr-2 text-yellow-300">
      <span v-if="MidiRealtimeEvent.includes(logEntry.eventType)" class="faded"
        >real time:</span
      >
      {{ MidiEventTypeLabel[logEntry.eventType] }}
      <template v-if="['noteon', 'noteoff'].includes(logEntry.eventType)">
        {{ logEntry.data[1] }}
      </template>
    </strong>
    <span v-if="logEntry.channel" class="mr-2">
      <span class="faded">channel</span> {{ logEntry.channel }}
    </span>
    <span
      v-if="logEntry.value && logEntry.eventType !== 'controlchange'"
      class="mr-2"
    >
      <span class="faded">value</span> {{ logEntry.value }}
    </span>
    <span v-if="logEntry.controller && logEntry.controller.number" class="mr-2">
      <span class="faded">controller</span> {{ logEntry.controller.number }}
    </span>
    <span v-if="logEntry.data && logEntry.data.length > 2" class="mr-2">
      <span class="faded">velocity</span> {{ logEntry.data[2] }}
    </span>
    <div v-if="logEntry.data && logEntry.data.length">
      <span class="sysex-label faded">Raw data</span>
      <LogDataValue :value="logEntry.data" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  ILogEntryMidi,
  MidiEventTypeLabel,
  MidiRealtimeEvent,
} from "./request-log-store";
import { convertToHexString } from "../../util";
import LogDataValue from "./LogDataValue.vue";

export default defineComponent({
  name: "ActivityMidi",
  components: {
    LogDataValue,
  },
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryMidi,
    },
  },
  setup() {
    return {
      convertToHexString,
      MidiEventTypeLabel,
      MidiRealtimeEvent,
    };
  },
});
</script>
