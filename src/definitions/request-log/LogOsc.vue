<template>
  <div class="border-b border-accent last:border-b-0">
    <strong class="mr-2 text-accent">OSC</strong>
    <span class="mr-2">{{ logEntry.address }}</span>
    <span class="mr-2 faded">{{ logEntry.typeTags }}</span>
    <span v-for="(arg, idx) in logEntry.args" :key="idx" class="mr-2">
      {{ arg }}
    </span>
    <div>
      <span class="sysex-label faded">Raw data</span>
      <LogDataValue :hex="logEntry.payloadHex" :dec="logEntry.payloadDec" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ILogEntryOsc } from "./request-log-store";
import LogDataValue from "./LogDataValue.vue";

export default defineComponent({
  name: "LogOsc",
  components: {
    LogDataValue,
  },
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryOsc,
    },
  },
});
</script>
