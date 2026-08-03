<template>
  <div class="border-b border-accent last:border-b-0">
    <strong class="mr-2 text-accent">
      {{ logEntry.label }}
      <template v-if="logEntry.note != undefined">
        {{ logEntry.note }}
      </template>
    </strong>
    <span v-if="logEntry.channel !== undefined" class="mr-2">
      <span class="faded">channel</span> {{ logEntry.channel }}
    </span>
    <span v-if="logEntry.value !== undefined" class="mr-2">
      <span class="faded">value</span> {{ logEntry.value }}
    </span>
    <span v-if="logEntry.controllerNumber !== undefined" class="mr-2">
      <span class="faded">controller</span> {{ logEntry.controllerNumber }}
      <template v-if="logEntry.velocity !== undefined">
        <span class="faded">value</span> {{ logEntry.velocity }}
      </template>
    </span>
    <span v-if="logEntry.parameterNumber !== undefined" class="mr-2">
      <span class="faded">parameter</span> {{ logEntry.parameterNumber }}
    </span>
    <span v-if="logEntry.note !== undefined" class="mr-2">
      <span class="faded">velocity</span> {{ logEntry.velocity }}
    </span>
    <div v-if="logEntry.dataDec && logEntry.dataDec.length">
      <span class="sysex-label faded">Raw data</span>
      <LogDataValue :hex="logEntry.dataHex" :dec="logEntry.dataDec" />
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
  name: "LogMidi",
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
